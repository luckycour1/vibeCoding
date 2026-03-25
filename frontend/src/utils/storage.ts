import { decrypt, encrypt } from './crypto';

const USE_ENCRYPTION = true;

/**
 * 本地存储封装（支持加密）
 */
export const storage = {
  /**
   * 设置存储
   */
  set(key: string, value: unknown, encryptData = USE_ENCRYPTION): void {
    try {
      let data = JSON.stringify(value);
      if (encryptData) {
        data = encrypt(data);
      }
      localStorage.setItem(key, data);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  /**
   * 获取存储
   */
  get<T>(key: string, decryptData = USE_ENCRYPTION): T | null {
    try {
      let data = localStorage.getItem(key);
      if (!data) return null;

      if (decryptData) {
        data = decrypt(data);
      }
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * 移除存储
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  },

  /**
   * 清空存储
   */
  clear(): void {
    localStorage.clear();
  }
};

/**
 * Session 存储封装
 */
export const sessionStorage = {
  set(key: string, value: unknown): void {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Session storage set error:', error);
    }
  },

  get<T>(key: string): T | null {
    try {
      const data = window.sessionStorage.getItem(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error('Session storage get error:', error);
      return null;
    }
  },

  remove(key: string): void {
    window.sessionStorage.removeItem(key);
  },

  clear(): void {
    window.sessionStorage.clear();
  }
};
