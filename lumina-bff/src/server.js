import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

import healthRoute from './routes/health.js';
import authRoute from './routes/auth.js';

const PORT = Number(process.env.PORT || 3030);
const isDev = process.env.NODE_ENV !== 'production';

const fastify = Fastify({
  logger: isDev
    ? { transport: { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss' } } }
    : true,
  trustProxy: true,
  bodyLimit: 1024 * 1024,
});

await fastify.register(cors, { origin: true });
await fastify.register(rateLimit, {
  global: true,
  max: 60,
  timeWindow: '1 minute',
  keyGenerator: (req) => req.ip,
});

await fastify.register(healthRoute);
await fastify.register(authRoute);

fastify.setNotFoundHandler((req, reply) => {
  reply.code(404).send({ error: 'not_found', path: req.url });
});

fastify.setErrorHandler((err, req, reply) => {
  req.log.error({ err }, 'unhandled error');
  reply.code(err.statusCode || 500).send({
    error: err.code || 'internal_error',
    message: isDev ? err.message : undefined,
  });
});

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  fastify.log.info(`lumina-bff listening on :${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
