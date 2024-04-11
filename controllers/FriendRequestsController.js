import { FriendRequestStatus, Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

class FriendRequestsController {

  async sendFriendRequest(req, res) {

    try {

      const { receiverId } = req.params;
      const userId = req.user.data.id;


      // Vérifier si une demande d'ami a déjà été envoyée par l'autre utilisateur.
      const existingFriendRequest = await prisma.friendRequest.findFirst({
        orderBy: {
          id: 'desc'
        },
        where: {
          AND: [
            { senderId: receiverId },
            { receiverId: userId },
          ],
        }
      })

      // Si une demande d'ami a déjà été envoyée par l'autre utilisateur, alors accepter la demande.
      if (existingFriendRequest?.status === FriendRequestStatus.PENDING) {
        const acceptFriendRequest = await prisma.friendRequest.update({
          where: {
            id: existingFriendRequest.id
          },
          data: {
            status: FriendRequestStatus.ACCEPTED,
            respondedAt: new Date()
          }
        })

        return res.status(200).json({ message: "Friend request accepted" });
        
      } else if (existingFriendRequest?.status === FriendRequestStatus.ACCEPTED) {
        return res.status(400).json({ message: "Friend request already accepted" });
      }

      // Sinon envoyer une demande d'ami
      const friendRequest = await prisma.friendRequest.create({
        data: {
          senderId: userId,
          receiverId: receiverId
        }
      })
      
      return res.status(200).json({ message: "Friend request sent" });

    } catch (error) {

      // Dans le cas où l'envoyeur a déjà envoyé une demande d'ami à la personne
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(400).json({ message: "Friend request already sent" });
      }

      return res.status(500).json({ message: error.message })
    }
  }

  async acceptFriendRequest(req, res) {

    try {
      
      const { requestId } = req.params;
      const userId = req.user.data.id;

      const friendRequest = await prisma.friendRequest.findFirst({
        where: {
          AND: [
            { id: parseInt(requestId) },
            { receiverId: userId },
            { status: FriendRequestStatus.PENDING }
          ]
        }
      })

      if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });
      
      const acceptFriendRequest = await prisma.friendRequest.update({
        where: {
          id: parseInt(requestId)
        },
        data: {
          status: FriendRequestStatus.ACCEPTED,
          respondedAt: new Date()
        }
      })


      return res.status(200).json({ message: "Friend request accepted" });

    } catch (error) {
      
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2001') {
        return res.status(404).json({ message: "Friend request not found" });
      }

      return res.status(500).json({ message: error.message });
    }
  }

  async declineFriendRequest(req, res) {

    try {
      
      const { requestId } = req.params;
      const userId = req.user.data.id;

      const friendRequest = await prisma.friendRequest.findFirst({
        where: {
          AND: [
            { id: parseInt(requestId) },
            { receiverId: userId },
            { status: FriendRequestStatus.PENDING }
          ]
        }
      })

      if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });

      const declineFriendRequest = await prisma.friendRequest.update({
        where: {
          id: parseInt(requestId)
        },
        data: {
          status: FriendRequestStatus.REJECTED,
          respondedAt: new Date()
        }
      })

      return res.status(200).json({ message: "Friend request declined" });

    } catch (error) {
      
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2001') {
        return res.status(404).json({ message: "Friend request not found" });
      }

      return res.status(500).json({ message: error.message });

    }
  }

  async cancelFriendRequest(req, res) {

    try {
      
      const { requestId } = req.params;
      const userId = req.user.data.id;

      const friendRequest = await prisma.friendRequest.findFirst({
        where: {
          AND: [
            { id: parseInt(requestId) },
            { senderId: userId },
            { status: FriendRequestStatus.PENDING }
          ]
        }
      }) 

      if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });

      const cancelFriendRequest = await prisma.friendRequest.delete({
        where: {
          id: parseInt(requestId)
        }
      }) 

      return res.status(200).json({ message: "Friend request canceled" });

    } catch (error) {
      
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2001') {
        return res.status(404).json({ message: "Friend request not found" });
      }

      return res.status(500).json({ message: error.message });

    }
  }

  async test(req, res) {

    try {
      const friendRequest = await prisma.friendRequest.findFirst({
        orderBy: {
          id: 'desc'
        }
      })

      if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });

      return res.status(200).json(friendRequest);

    } catch (error) {
      
      return res.status(500).json({ message: error.message });
    }

  }
  
}

export default new FriendRequestsController();