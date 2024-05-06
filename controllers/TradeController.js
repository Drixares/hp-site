import { TradeRequestStatus } from "@prisma/client";
import prisma from "../config/prisma.js";


class TradeController {
  
  async askTrade(req, res) {
    
    try {
      
      const { friendId, requestedCard, giftCard} = req.body;
      const userId = req.user.data.id;
      
      // verify if the user owns the card
      const hasCard = await prisma.userCard.findFirst({
        where: {
          userId,
          cardId: parseInt(giftCard),
        }
      })

      if (!hasCard) return res.status(404).json({ message: "You don't own the card." })
      const hasOneCard = hasCard.quantity > 1 ? false : true 
          
      // verify if the friend exist
      const isFriend = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: friendId, status: 'ACCEPTED' },
            { senderId: friendId, receiverId: userId, status: 'ACCEPTED' }
          ]
        }
      })
      
      if (!isFriend) return res.status(404).json({ message: "Friend not found." })

      // verify if there is already a trade request pending
      const existingRequest = await prisma.tradeRequest.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: friendId, status: 'PENDING' },
            { senderId: friendId, receiverId: userId, status: 'PENDING' }
          ]
        }
      })

      // if exists return message
      if (existingRequest) return res.status(400).json({ message: "You must respond or wait a reply from the pending trade with this friend." })
      
      // if not, send the request
      const tradeRequest = await prisma.tradeRequest.create({
        data: {
          senderId: userId,
          receiverId: friendId,
          giftedCardId: parseInt(giftCard),
          receivedCardId: parseInt(requestedCard)
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

      if (!tradeRequest) return res.status(500).json({ message: "An error occured while sending the request." })
        
      // If all good, update user's card quantity
      if (hasOneCard) {
        const deletecard = await prisma.userCard.delete({
          where: {
            userId_cardId: {
              userId: userId,
              cardId: parseInt(giftCard),
            }
          }
        })

        if (!deletecard) return res.status(500).json({ message: "An error occured while sending the request." })
      
      } else {
        const updateCardQuantity = await prisma.userCard.update({
          where: {
            userId_cardId: {
              userId: userId,
              cardId: parseInt(giftCard),
            }
          },
          data: {
            quantity: {
              decrement: 1,
            }
          }
        })
        
        if (!updateCardQuantity) return res.status(500).json({ message: "An error occured while sending the request." })
      }


      // ALL CONDITIONS PASSED
      return res.status(200).json({ tradeRequest, message: "Trade request sent !" }) 

    } catch (error) {

      return res.status(500).json({ message: error.message })
    }


  }

  async acceptTrade(req, res) {

    try {
      
      const { requestId } = req.params;
      const userId = req.user.data.id;

      // verify if the request exists
      const tradeRequest = await prisma.tradeRequest.findFirst({
        where: {
          id: parseInt(requestId),
          receiverId: userId,
          status: TradeRequestStatus.PENDING
        }
      })

      if (!tradeRequest) return res.status(404).json({ message: "Trade request not found." })

      // verify if the friend exist
      const isFriend = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: tradeRequest.senderId, status: 'ACCEPTED' },
            { senderId: tradeRequest.senderId, receiverId: userId, status: 'ACCEPTED' }
          ]
        }
      })

      if (!isFriend) return res.status(404).json({ message: "Friend not found." })

      // verify if the user owns the card
      const hasCard = await prisma.userCard.findFirst({
        where: {
          userId,
          cardId: tradeRequest.receivedCardId,
        },
        select: {
          quantity: true
        }
      })

      if (!hasCard) return res.status(404).json({ message: "You don't own the card." })
      const hasOneCard = hasCard.quantity > 1 ? false : true

      if (hasOneCard) {
        const deletecard = await prisma.userCard.delete({
          where: {
            userId_cardId: {
              userId: userId,
              cardId: tradeRequest.receivedCardId,
            }
          }
        })

        if (!deletecard) return res.status(500).json({ message: "An error occured while sending the request." })

      } else {
        const updateCardQuantity = await prisma.userCard.update({
          where: {
            userId: userId,
            cardId: tradeRequest.receivedCardId,
          },
          data: {
            quantity: {
              decrement: 1,
            }
          }
        })
        
        if (!updateCardQuantity) return res.status(500).json({ message: "An error occured while sending the request." })
      }

      // update trade request status
      const acceptedTrade = await prisma.tradeRequest.update({
        where: {
          id: parseInt(requestId),
        },
        data: {
          status: 'ACCEPTED'
        }
      })

      if (!acceptedTrade) return res.status(500).json({ message: "An error occured while sending the request." })

      return res.status(200).json({ message: "Trade request accepted !" })

    } catch (error) {
      
      return res.status(500).json({ message: error.message })
    }

  }

  async declineTrade(req, res) {

    try {
      
      const { requestId } = req.params;
      const userId = req.user.data.id;

      // verify if the request exists
      const tradeRequest = await prisma.tradeRequest.findFirst({
        where: {
          id: parseInt(requestId),
          receiverId: userId,
          status: TradeRequestStatus.PENDING
        }
      })

      if (!tradeRequest) return res.status(404).json({ message: "Trade request not found." })

      // verify if the friend exist
      const isFriend = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: tradeRequest.senderId, status: 'ACCEPTED' },
            { senderId: tradeRequest.senderId, receiverId: userId, status: 'ACCEPTED' }
          ]
        },
      })

      if (!isFriend) return res.status(404).json({ message: "Friend not found." })

      // delete trade request status
      const declinedTrade = await prisma.tradeRequest.delete({
        where: {
          id: parseInt(requestId),
        }
      })

      if (!declinedTrade) return res.status(500).json({ message: "An error occured while declining the request." })

      // Give the card back to the user
      const hasCard = await prisma.userCard.findFirst({
        where: {
          userId: tradeRequest.senderId,
          cardId: tradeRequest.giftedCardId,
        },
      })

      if (hasCard) {
        const updateCardQuantity = await prisma.userCard.update({
          where: {
            userId_cardId: {
              userId: tradeRequest.senderId,
              cardId: tradeRequest.giftedCardId,
            }
          },
          data: {
            quantity: {
              increment: 1,
            }
          }
        })

        if (!updateCardQuantity) return res.status(500).json({ message: "An error occured while declining the request." })
      } else {
        const createCard = await prisma.userCard.create({
          data: {
            userId: tradeRequest.senderId,
            cardId: tradeRequest.giftedCardId,
            quantity: 1
          }
        })

        if (!createCard) return res.status(500).json({ message: "An error occured while declining the request." })
      }


      return res.status(200).json({ message: "Trade request declined !" })

    } catch (error) {
      
      return res.status(500).json({ message: error.message })
    }

  }

  async cancelTrade(req, res) {

    try {
      
      const { requestId } = req.params;
      const userId = req.user.data.id;

      // verify if the request exists
      const tradeRequest = await prisma.tradeRequest.findFirst({
        where: {
          id: parseInt(requestId),
          senderId: userId,
          status: TradeRequestStatus.PENDING
        }
      })

      if (!tradeRequest) return res.status(404).json({ message: "Trade request not found." })

      // delete trade request status
      const canceledTrade = await prisma.tradeRequest.delete({
        where: {
          id: parseInt(requestId),
        }
      })

      if (!canceledTrade) return res.status(500).json({ message: "An error occured while canceling the request." })

      // Give the card back to the user
      const hasCard = await prisma.userCard.findFirst({
        where: {
          userId: tradeRequest.senderId,
          cardId: tradeRequest.giftedCardId,
        },
      })

      if (hasCard) {
        const updateCardQuantity = await prisma.userCard.update({
          where: {
            userId_cardId: {
              userId: tradeRequest.senderId,
              cardId: tradeRequest.giftedCardId,
            }
          },
          data: {
            quantity: {
              increment: 1,
            }
          }
        })

        if (!updateCardQuantity) return res.status(500).json({ message: "An error occured while canceling the request." })

      } else {
        const createCard = await prisma.userCard.create({
          data: {
            userId: tradeRequest.senderId,
            cardId: tradeRequest.giftedCardId,
            quantity: 1
          }
        })

        if (!createCard) return res.status(500).json({ message: "An error occured while canceling the request." })
      }

      return res.status(200).json({ message: "Trade request canceled !" })

    } catch (error) {
      
    }

  }

  async seeTradeRequest(req, res) {

    try {
      
      const userId = req.user.data.id;
      const { requestId } = req.params;

      // verify if the request exists
      const request =  await prisma.tradeRequest.findFirst({
        where: {
          id: parseInt(requestId),
          receiverId: userId,
        },
        select: {
          id: true,
          sender: {
            select: {
              name: true,
            }
          },
          giftedCard: {
            select: {
              id: true,
              name: true,
            }
          },
          receivedCard: {
            select: {
              id: true,
              name: true,
            }
          },
        }
      })

      if (!request) return res.status(404).json({ message: "Trade request not found." })

      return res.status(200).json({ request })

    } catch (error) {
      
      return res.status(500).json({ message: error.message })
    }

  }
}

export default new TradeController();