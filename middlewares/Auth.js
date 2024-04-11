import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
dotenv.config()

export function authentificationToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    
    if (err) return res.sendStatus(403);

    const user = prisma.user.findUnique({
      where: {
        email: payload.data
      }
    });

    if (!user) return res.sendStatus(403)

    req.user = payload;

    next();
  });
}