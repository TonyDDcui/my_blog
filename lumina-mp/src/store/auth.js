import { defineStore } from 'pinia';
import { api, setToken, getToken, clearToken } from '../service/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    ready: false,
  }),
  getters: {
    isLogin: (s) => !!s.user,
  },
  actions: {
    async bootstrap() {
      if (getToken()) {
        try {
          const { user } = await api.me();
          this.user = user;
        } catch {
          clearToken();
        }
      }
      this.ready = true;
    },
    async login() {
      const code = await new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: ({ code }) => resolve(code),
          fail: reject,
        });
      });
      let nickname = '', avatar_url = '';
      try {
        const profile = await new Promise((resolve, reject) => {
          uni.getUserProfile({
            desc: '用于展示你的昵称和头像',
            success: ({ userInfo }) => resolve(userInfo),
            fail: reject,
          });
        });
        nickname = profile.nickName;
        avatar_url = profile.avatarUrl;
      } catch {}
      const { token, user } = await api.wxLogin({ code, nickname, avatar_url });
      setToken(token);
      this.user = user;
      return user;
    },
    logout() {
      clearToken();
      this.user = null;
    },
  },
});
