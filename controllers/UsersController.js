import vine, { errors } from '@vinejs/vine';
import { v4 as uuidv4 } from 'uuid';
import prisma from "../config/prisma.js";
import { comparePassword, hashPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { loginValidator, storeUserValidator } from '../validators/userValidator.js';

class UsersController {

  async signup(req, res) {
    const body = req.body;
    try {
      const output =  await vine.validate({
        schema: storeUserValidator,
        data: body
      });
      
      const user =  await prisma.user.create({
        data: {
          id: uuidv4(),
          email: output.email,
          name: output.name,
          password: await hashPassword(output.password),
        }
      });

      const token = generateToken(user);

      return res.status(201).json({ message: "User created successfully", token: token });

    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ message: error.messages[0].message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req, res) {

    try {

      const body = req.body;

      const output = await vine.validate({
        schema: loginValidator,
        data: body
      })

      const user = await prisma.user.findUnique({
        where: {
          email: output.email
        }
      })

      if (!user) return res.status(404).json({ message: "User not found"});
      const match = await comparePassword(body.password, user.password);
      if (!match) return res.status(401).json({ message: "Invalid credentials"})

      const token = generateToken(user)

      return res.status(200).json({ message: "User connected !", token: token })

    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(500).json({ message: error.messages[0].message })
      }

      return res.status(500).json({ message: "Internal server error" })
    }

  }

  async logout(req, res) {
    return res.status(200).json({ message: "User logged out successfully" });
  }

  async searchUser(req, res) {
    
    try {

      const userId = req.user.data.id;
      const searchq = req.body.searchQuery;

      if (!searchq || !/\S/.test(searchq)) return res.json({ message: "Search query is required and should not be only spaces" });

      const users = await prisma.user.findMany({
        take: 10,
        where: {
          name: {
            contains: searchq
          },
          NOT: {
            id: userId,
          }
        },
        select: {
          id: true,
          name: true,
          sentFriendRequests: {
            where: {
              receiverId: userId,
              status: 'ACCEPTED'
            },
          },
          receivedFriendRequests: {
            where: {
              senderId: userId,
              status: 'ACCEPTED'
            },
          }
        }
      });

      if (!users || !users.length ) return res.status(404).json({ message: "No results found" });

      return res.status(200).json(users)

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

}

export default new UsersController();