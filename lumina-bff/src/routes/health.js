export default async function (fastify) {
  fastify.get('/api/health', async () => ({
    status: 'ok',
    service: 'lumina-bff',
    version: '0.1.0',
    time: new Date().toISOString(),
    uptime_sec: Math.round(process.uptime()),
  }));
}
