<script setup>
import { useAuthStore } from '../../store/auth';
const auth = useAuthStore();
</script>

<template>
  <view class="container">
    <view class="hero">
      <text class="title">我的</text>
    </view>
    <view class="card" v-if="auth.isLogin">
      <text class="name">{{ auth.user?.nickname || '旅行者' }}</text>
      <text class="oid">openid {{ (auth.user?.wx_openid || '').slice(0, 8) }}...</text>
      <button class="btn-secondary" @tap="auth.logout">退出登录</button>
    </view>
    <view class="card" v-else>
      <text class="hint">未登录</text>
      <button class="btn-primary" @tap="auth.login">微信登录</button>
    </view>
  </view>
</template>

<style scoped>
.container { padding: 48rpx 32rpx; }
.title { font-size: 48rpx; font-weight: 700; margin-bottom: 32rpx; }
.card { background: #fff; border-radius: 24rpx; padding: 36rpx; }
.name { display: block; font-size: 36rpx; font-weight: 600; }
.oid { display: block; font-size: 24rpx; color: #aaa; margin-top: 8rpx; margin-bottom: 24rpx; }
.btn-primary, .btn-secondary {
  border-radius: 999rpx; font-size: 30rpx; padding: 22rpx 0; margin: 0;
}
.btn-primary { background: #111; color: #fff; }
.btn-secondary { background: #f4f4f0; color: #111; border: 2rpx solid #e6e6df; }
.btn-primary::after, .btn-secondary::after { border: none; }
.hint { display: block; font-size: 28rpx; color: #888; margin-bottom: 24rpx; }
</style>
