import { verify } from '../lib/jwt.js';

export async function jwtAuth(req, reply) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    reply.code(401).send({ error: 'missing_token' });
    return reply;
  }
  const payload = verify(token);
  if (!payload) {
    reply.code(401).send({ error: 'invalid_token' });
    return reply;
  }
  req.user = payload;
}
