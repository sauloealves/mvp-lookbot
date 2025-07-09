import jwt from 'jsonwebtoken';

export default function autenticar(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ erro: 'Token ausente' });

  try {
    const token = auth.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.lojaId = payload.lojaId;
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}
