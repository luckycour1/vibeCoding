import dayjs from 'dayjs';

/**
 * 格式化日期时间
 */
export function formatDateTime(date: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format);
}

/**
 * 格式化日期
 */
export function formatDate(date: string | number | Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

/**
 * 格式化金额
 */
export function formatMoney(amount: number, decimals = 2): string {
  return `¥${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * 格式化数字（千分位）
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 脱敏手机号
 */
export function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 脱敏邮箱
 */
export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  const maskedName = name.length > 2 ? name.slice(0, 2) + '***' : name[0] + '**';
  return `${maskedName}@${domain}`;
}
