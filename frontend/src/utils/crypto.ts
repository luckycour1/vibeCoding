import CryptoJS from 'crypto-js';
import { ENV } from '@/config';

const SECRET_KEY = ENV.ENCRYPT_KEY;

/**
 * AES 加密
 */
export function encrypt(data: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return data;
  }
}

/**
 * AES 解密
 */
export function decrypt(data: string): string {
  try {
    const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return data;
  }
}

/**
 * MD5 哈希
 */
export function md5(data: string): string {
  return CryptoJS.MD5(data).toString();
}
