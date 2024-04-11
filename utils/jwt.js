import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign({
    data: {
      email: user.email,
      id: user.id
    }
  }, process.env.TOKEN_SECRET, 
  {
    expiresIn: '30d'
  }
  );
}