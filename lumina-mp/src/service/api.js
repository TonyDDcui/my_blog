import { API_BASE } from './config';

const TOKEN_KEY = 'lumina_token';

export function getToken() {
  try {
    return uni.getStorageSync(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token);
}

export function clearToken() {
  uni.removeStorageSync(TOKEN_KEY);
}

export function request(path, { method = 'GET', data, header = {}, timeout = 15000 } = {}) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    uni.request({
      url: API_BASE + path,
      method,
      data,
      timeout,
      header: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...header,
      },
      success: ({ statusCode, data: body }) => {
        if (statusCode === 401) {
          clearToken();
          return reject({ code: 'unauthorized', body });
        }
        if (statusCode >= 200 && statusCode < 300) {
          resolve(body);
        } else {
          reject({ code: 'http_' + statusCode, body });
        }
      },
      fail: (err) => reject({ code: 'network', detail: err }),
    });
  });
}

export const api = {
  health: () => request('/api/health'),
  wxLogin: ({ code, nickname, avatar_url }) =>
    request('/api/wx/login', { method: 'POST', data: { code, nickname, avatar_url } }),
  me: () => request('/api/me'),
};
