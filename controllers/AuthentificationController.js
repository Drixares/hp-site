import prisma from "../config/prisma.js";

class AuthentificationController {

  async getUser(req, res) {
    
    try {
      const userEmail = req.user.data.email;

      const user = await prisma.user.findUnique({
        where: {
          email: userEmail
        },
        include: {
          sentFriendRequests: true,
          receivedFriendRequests: true,
        }
      })

      if (!user) return res.status(404).json({ message: "User not found"});

      return res.status(200).json({
        message: "User data found",
        user: {
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          next_booster: user.booster,
          sentFriendRequests: user.sentFriendRequests,
          receivedFriendRequests: user.receivedFriendRequests
        }
      })

      // return res.status(200).json(user);

    } catch(error) {
      return res.status(500).json({ message: "Internal server error"})
    }
  }
  
}

export default new AuthentificationController();