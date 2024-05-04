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
            userId: userId,
            cardId: parseInt(giftCard),
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

  async acceptTrade(req, res) {}

  async declineTrade(req, res) {}

  async cancelTrade(req, res) {}
}

export default new TradeController();