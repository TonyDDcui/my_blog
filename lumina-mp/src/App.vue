<script setup>
import { onLaunch, onShow } from '@dcloudio/uni-app';
import { useAuthStore } from './store/auth';

const auth = useAuthStore();

onLaunch(async () => {
  await auth.bootstrap();
});

onShow(() => {});
</script>

<style>
page {
  background: #fafaf7;
  font-family: -apple-system, system-ui, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #1a1a1a;
}

.container {
  padding: 32rpx;
}

.title {
  font-size: 48rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
</style>
