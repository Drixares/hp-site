import { FriendRequestStatus, TradeRequestStatus } from "@prisma/client";
import prisma from "../config/prisma.js";

class AuthentificationController {

  async getUser(req, res) {
    
    try {
      const userEmail = req.user.data.email;

      const user = await prisma.user.findUnique({
        where: {
          email: userEmail
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          booster: true,
          sentFriendRequests: {
            where: {
              NOT: {
                status: FriendRequestStatus.REJECTED
              }
            },
            select: {
              id: true,
              status: true,
              sentAt: true,
              receiver: {
                select: {
                  name: true,
                }
              }
            }
          },
          receivedFriendRequests: {
            where: {
              NOT: {
                status: FriendRequestStatus.REJECTED
              }
            },
            select: {
              id: true,
              status: true,
              sentAt: true,
              sender: {
                select: {
                  name: true,
                }
              }
            }
          },
          sentTradeRequests: {
            where: {
              NOT: {
                status: TradeRequestStatus.REJECTED
              }
            },
            select: {
              id: true,
              status: true,
              sentAt: true,
              receiver: {
                select: {
                  name: true,
                }
              }
            }
          },
          receivedTradeRequests: {
            where: {
              NOT: {
                status: TradeRequestStatus.REJECTED
              }
            },
            select: {
              id: true,
              status: true,
              sentAt: true,
              sender: {
                select: {
                  name: true,
                }
              }
            }
          },
        },
      })

      if (!user) return res.status(404).json({ message: "User not found"});

      return res.status(200).json({ message: "User data found", user })
      
    } catch(error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message })
    }
  }
  
}

export default new AuthentificationController();