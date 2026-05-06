import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

if (!SECRET || SECRET === 'replace_me_with_a_64_char_random_hex') {
  console.warn('[jwt] JWT_SECRET 未设置或仍为占位值，生产环境务必替换');
}

export function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verify(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
