import { FriendRequestStatus, Prisma, TradeRequestStatus } from "@prisma/client";
import prisma from "../config/prisma.js";

class FriendRequestsController {

  // Send friend request
  async sendFriendRequest(req, res) {

    try {

      const { receiverId } = req.params;
      const userId = req.user.id;

      if (userId === receiverId) return res.status(400).json({ message: 'You cannot ask yourself to be friend :/' })

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
        },
        select: {
          status: true,
          id: true,
          receiver: {
            select: {
              name: true,
            }
          }
        }
      })
      
      return res.status(200).json({ message: "Friend request sent", friendRequest });

    } catch (error) {

      // Dans le cas où l'envoyeur a déjà envoyé une demande d'ami à la personne
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(400).json({ message: "Friend request already used or/and rejected." });
      }

      return res.status(500).json({ message: error.message })
    }
  }

  // Accept friend request
  async acceptFriendRequest(req, res) {

    try {
      
      const { requestId } = req.params;
      const userId = req.user.id;

      const isFriendRequest = await prisma.friendRequest.findFirst({
        where: {
          AND: [
            { id: parseInt(requestId) },
            { receiverId: userId },
            { status: FriendRequestStatus.PENDING }
          ]
        }
      })

      if (!isFriendRequest) return res.status(404).json({ message: "Friend request not found" });
      
      const friendRequest = await prisma.friendRequest.update({
        where: {
          id: parseInt(requestId)
        },
        data: {
          status: FriendRequestStatus.ACCEPTED,
          respondedAt: new Date()
        },
        select: {
          status: true,
          id: true,
          sender: {
            select: {
              name: true,
            }
          }
        }
      })

      return res.status(200).json({ message: "Friend request accepted", friendRequest });

    } catch (error) {
      
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2001') {
        return res.status(404).json({ message: "Friend request not found" });
      }

      return res.status(500).json({ message: error.message });
    }
  }

  // Decline friend request
  async declineFriendRequest(req, res) {

    try {
      
      const { requestId } = req.params;
      const userId = req.user.id;

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

  // Cancel friend request
  async cancelFriendRequest(req, res) {

    try {
      
      const { requestId } = req.params;
      const userId = req.user.id;

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

  async removeFriend(req, res) {

    try {
      
      const { requestId } = req.params;
      const userId = req.user.id;

      // Verify if the friend exists
      const friend = await prisma.friendRequest.findFirst({
        where: {
          AND: [
            { id: parseInt(requestId) },
            { OR: [
              { senderId: userId },
              { receiverId: userId }
            ]},
            { status: FriendRequestStatus.ACCEPTED }
          ]
        },
        select: {
          id: true,
          senderId: true,
          receiverId: true
        }
      })

      console.log("test1");

      if (!friend) return res.status(404).json({ message: 'Friend not found.' })

      // Delete the friend
      await prisma.friendRequest.delete({
        where: {
          id: parseInt(requestId)
        }
      })

      console.log("test2");


      // Looking for the trade request to delete
      const tradeToDelete = await prisma.tradeRequest.findFirst({
        where: {
          OR: [
            { senderId: friend.senderId, receiverId: friend.receiverId, status: TradeRequestStatus.PENDING},
            { senderId: friend.receiverId, receiverId: friend.senderId, status: TradeRequestStatus.PENDING}
          ]
        },
        select: {
          id: true,
          senderId: true,
          giftedCardId: true,
        }
      })

      if (tradeToDelete) {
        // Delete the trade request
        await prisma.tradeRequest.delete({
          where: {
            id: tradeToDelete.id
          },
        })

        // Give the card back to the sender
        const hasCard = await prisma.userCard.findUnique({
          where: {
            userId_cardId: {
              userId: tradeToDelete.senderId,
              cardId: tradeToDelete.giftedCardId
            }
          }
        })
  
        if (!hasCard) {
          await prisma.userCard.create({
            data: {
              userId: tradeToDelete.senderId,
              cardId: tradeToDelete.giftedCardId
            }
          })
  
        } else {
          await prisma.userCard.update({
            where: {
              userId_cardId: {
                userId: tradeToDelete.senderId,
                cardId: tradeToDelete.giftedCardId
              }
            },
            data: {
              quantity: {
                increment: 1
              }
            }
          })
          
        }
      }


      return res.status(200).json({ message: 'Friend successfully removed.' })

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ message: 'Friend not found.' })
      } else {
        return res.status(500).json({ message: error.message });
      }
      
    }

  }

  async getFriends(req, res) {

    try {
      
      const userEmail = req.user.email;

      const allFriends = await prisma.user.findMany({
        where: {
          email: userEmail,
        },
        select: {
          receivedFriendRequests: {
            where: {
              status: 'ACCEPTED'
            },
            select: {
              id: true,
              respondedAt: true,
              sender: {
                select: {
                  name: true,
                  id: true,
                }
              }
            }
          },
          sentFriendRequests: {
            where: {
              status: 'ACCEPTED'
            },
            select: {
              id: true,
              respondedAt: true,
              receiver: {
                select: {
                  name: true,
                  id: true,
                }
              }
            }
          }

        }
      })

      if (!allFriends) return res.status(404).json({ message: 'No friends found.' })

      const friends = allFriends[0].receivedFriendRequests.concat(allFriends[0].sentFriendRequests)

      return res.status(200).json(friends)

    } catch (error) {
      
      return res.status(500).json(error.message)
    }
  }
  
}

export default new FriendRequestsController();