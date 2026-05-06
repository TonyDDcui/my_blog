<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../store/auth';

const auth = useAuthStore();
const health = ref('');

onMounted(async () => {
  try {
    const { default: req } = await import('../../service/api');
    const res = await req.api.health();
    health.value = `BFF ${res.status} · ${res.version}`;
  } catch {
    health.value = '未连上 BFF（W1 阶段尚未部署 ECS / DNS）';
  }
});

function handleLogin() {
  auth.login().catch((err) => {
    uni.showToast({ title: '登录失败', icon: 'none' });
    console.warn(err);
  });
}

function goWishlist() {
  uni.switchTab({ url: '/pages/wishlist/wishlist' });
}
</script>

<template>
  <view class="container">
    <view class="hero">
      <text class="hero-tag">AI 出行助手</text>
      <text class="hero-title">把"周末出去玩"变成可执行清单</text>
      <text class="hero-sub">输入愿望，AI 给候选；多人协同询价、选定、记账、平账。</text>
    </view>

    <view class="card" v-if="!auth.isLogin">
      <text class="card-title">先用微信登录</text>
      <button class="btn-primary" @tap="handleLogin">微信登录</button>
    </view>

    <view class="card" v-else>
      <text class="card-title">你好，{{ auth.user?.nickname || '旅行者' }}</text>
      <text class="card-sub">还没有进行中的行程，点下面新建一个。</text>
      <button class="btn-primary" @tap="goWishlist">新建行程</button>
    </view>

    <view class="footer">
      <text>{{ health || '正在连接服务器…' }}</text>
    </view>
  </view>
</template>

<style scoped>
.container {
  padding: 48rpx 32rpx;
}
.hero {
  display: flex;
  flex-direction: column;
  margin-bottom: 48rpx;
}
.hero-tag {
  font-size: 24rpx;
  color: #888;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  margin-bottom: 12rpx;
}
.hero-title {
  font-size: 56rpx;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16rpx;
}
.hero-sub {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 36rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.card-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}
.card-sub {
  display: block;
  font-size: 26rpx;
  color: #888;
  margin-bottom: 24rpx;
}
.btn-primary {
  background: #111;
  color: #fff;
  border-radius: 999rpx;
  font-size: 30rpx;
  padding: 22rpx 0;
  margin: 0;
}
.btn-primary::after {
  border: none;
}
.footer {
  margin-top: 64rpx;
  text-align: center;
  font-size: 22rpx;
  color: #aaa;
}
</style>
