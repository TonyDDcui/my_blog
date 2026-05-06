import { code2session } from '../lib/wx.js';
import { sign } from '../lib/jwt.js';
import { getSupabase } from '../lib/supabase.js';
import { jwtAuth } from '../middleware/jwtAuth.js';

export default async function (fastify) {
  fastify.post('/api/wx/login', async (req, reply) => {
    const { code, nickname, avatar_url } = req.body || {};
    if (!code) return reply.code(400).send({ error: 'missing_code' });

    let openid;
    try {
      const session = await code2session(code);
      openid = session.openid;
    } catch (err) {
      req.log.error({ err }, 'code2session 失败');
      return reply.code(502).send({ error: 'wx_code2session_failed', detail: err.message });
    }

    const supa = getSupabase();
    const { data: user, error } = await supa
      .from('user')
      .upsert(
        {
          wx_openid: openid,
          nickname: nickname || null,
          avatar_url: avatar_url || null,
        },
        { onConflict: 'wx_openid' }
      )
      .select()
      .single();

    if (error) {
      req.log.error({ error }, 'user upsert 失败');
      return reply.code(500).send({ error: 'db_upsert_failed', detail: error.message });
    }

    const token = sign({ uid: user.id, openid });
    return { token, user };
  });

  fastify.get('/api/me', { preHandler: jwtAuth }, async (req) => {
    return { user: req.user };
  });
}
