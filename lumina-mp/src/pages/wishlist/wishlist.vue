<script setup>
import { ref } from 'vue';

const wish = ref('');

function generate() {
  uni.showToast({ title: 'AI 生成将在 W3 接入', icon: 'none' });
}
</script>

<template>
  <view class="container">
    <view class="hero">
      <text class="title">我想去做什么</text>
      <text class="subtitle">先把愿望写下来，AI 会帮你拆解成可执行清单。</text>
    </view>
    <textarea
      class="wish"
      v-model="wish"
      placeholder="例：5.1-5.3 五一假期，五人，舟山或附近海岛，看日出，海钓，预算 5000 内"
      maxlength="500"
    />
    <button class="btn-primary" @tap="generate">AI 生成清单</button>
    <text class="hint">W4 起接通：3 次 / 天免费额度</text>
  </view>
</template>

<style scoped>
.container { padding: 48rpx 32rpx; }
.hero { margin-bottom: 32rpx; }
.title { font-size: 48rpx; font-weight: 700; }
.subtitle { display: block; font-size: 26rpx; color: #666; margin-top: 12rpx; line-height: 1.6; }
.wish {
  width: 100%;
  min-height: 320rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  border: 2rpx solid #eee;
  background: #fff;
  box-sizing: border-box;
  font-size: 28rpx;
}
.btn-primary {
  margin-top: 32rpx;
  background: #111;
  color: #fff;
  border-radius: 999rpx;
  font-size: 30rpx;
  padding: 22rpx 0;
}
.btn-primary::after { border: none; }
.hint { display: block; margin-top: 24rpx; font-size: 24rpx; color: #aaa; text-align: center; }
</style>
