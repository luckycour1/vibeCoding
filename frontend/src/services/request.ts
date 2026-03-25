import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios';
import { ENV, RESPONSE_CODE, WHITE_LIST } from '@/config';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/config';
import { useAuthStore } from '@/store/authStore';
import { useGlobalStore } from '@/store/globalStore';
import { message } from 'antd';

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求队列（用于取消重复请求）
const pendingMap = new Map<string, AbortController>();

/**
 * 生成请求唯一标识
 */
function getRequestKey(config: AxiosRequestConfig): string {
  return `${config.method}_${config.url}_${JSON.stringify(config.params)}_${JSON.stringify(config.data)}`;
}

/**
 * 添加请求到队列
 */
function addPending(config: AxiosRequestConfig): void {
  const key = getRequestKey(config);
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingMap.set(key, controller);
}

/**
 * 移除请求从队列
 */
function removePending(config: AxiosRequestConfig): void {
  const key = getRequestKey(config);
  if (pendingMap.has(key)) {
    pendingMap.delete(key);
  }
}

/**
 * 取消重复请求
 */
function cancelPending(config: AxiosRequestConfig): void {
  const key = getRequestKey(config);
  if (pendingMap.has(key)) {
    const controller = pendingMap.get(key);
    controller?.abort();
    pendingMap.delete(key);
  }
}

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 取消重复请求
    cancelPending(config);
    addPending(config);

    // 添加 Token
    const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 显示加载状态
    const { setLoading } = useGlobalStore.getState();
    setLoading(true);

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    removePending(response.config);

    // 隐藏加载状态
    const { setLoading } = useGlobalStore.getState();
    setLoading(false);

    const { data } = response;

    // 处理业务错误
    if (data.code !== RESPONSE_CODE.SUCCESS) {
      message.error(data.message || '请求失败');

      // Token 过期处理
      if (data.code === RESPONSE_CODE.TOKEN_EXPIRED || data.code === RESPONSE_CODE.UNAUTHORIZED) {
        const { refreshAccessToken, logout } = useAuthStore.getState();
        refreshAccessToken().then((success) => {
          if (!success) {
            logout();
            window.location.href = '/login';
          }
        });
      }

      return Promise.reject(new Error(data.message));
    }

    return data.data;
  },
  async (error: AxiosError) => {
    const { config } = error;
    if (config) {
      removePending(config);
    }

    // 隐藏加载状态
    const { setLoading } = useGlobalStore.getState();
    setLoading(false);

    // 处理网络错误
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case RESPONSE_CODE.UNAUTHORIZED:
          message.error('登录已过期，请重新登录');
          useAuthStore.getState().logout();
          window.location.href = '/login';
          break;
        case RESPONSE_CODE.FORBIDDEN:
          message.error('没有权限访问该资源');
          break;
        case RESPONSE_CODE.NOT_FOUND:
          message.error('请求的资源不存在');
          break;
        case RESPONSE_CODE.ERROR:
          message.error('服务器内部错误');
          break;
        default:
          message.error(`请求失败: ${status}`);
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接');
    } else {
      message.error(error.message || '请求失败');
    }

    return Promise.reject(error);
  }
);

export default request;