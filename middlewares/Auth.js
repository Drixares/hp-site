import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
dotenv.config()

export function authentificationToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
    
    if (err) return res.sendStatus(403);

    const user = await prisma.user.findUnique({
      where: {
        email: payload.data.email
      },
      select: {
        id: true,
        email: true,
        name: true,
        booster: true,
      }
    });

    if (!user) return res.sendStatus(403)

    req.user = user;

    next();
  });
}