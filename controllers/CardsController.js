import prisma from "../config/prisma.js";

class CardsController {

  async index(req, res) {

    try {

      const cards = await prisma.card.findMany({
        orderBy: {
          name: "asc"
        }
      });

      return res.status(200).json(cards)

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async store(req, res) {

    try {

      const body = req.body

      body.forEach(async perso => {
        const card = {
          name: perso.name,
          species: perso.species,
          gender: perso.gender,
          house: perso.house ? perso.house : null,
          dateOfBirth: perso.dateOfBirth,
          actor: perso.actor,
          image: perso.image
        }
        
        const cardToStore = await prisma.card.create({
          data: card
        })
      });

      return res.status(200).json({ message: 'Cards created' })
    
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async show(req, res) {

    try {

      const id = req.params.id

      const card = await prisma.card.findUnique({
        where: {
          id: parseInt(id)
        }
      })

      if (!card) return res.status(404).json({ message: 'Card not found' })

      return res.status(200).json(card)

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async deleteCardFromUser(req, res) {

    const user = req.user;

    try {

      const userFound = await prisma.user.findUnique({
        where: {
          email: user.data.email,
        }
      })
      
      if (!userFound) return res.status(404).json({ message: 'User not found' })

      const userCard = await prisma.userCard.delete({
        where: {
          userId_cardId: {
            userId: userFound.id,
            cardId: parseInt(req.params.cardId)
          },
        },
      });

      return res.status(200).json({ message: 'Card deleted' })

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async addCardToUser(req, res) {

    const user = req.user;

    try {

      const userFound = await prisma.user.findUnique({
        where: {
          email: user.data.email,
        }
      })

      if (!userFound) return res.status(404).json({ message: 'User not found' })
      
      const userCard = await prisma.userCard.create({
        data: {
          userId: userFound.id,
          cardId: parseInt(req.params.cardId)
        }
      }); 

      return res.status(200).json({ message: 'Card added' })

    } catch (error) {
      
      return res.status(500).json({ message:  error.message })
    }

  }

  async showUserCards(req, res) {

    const user = req.user;

    try {

      const userFound = await prisma.user.findUnique({
        where: {
          email: user.data.email,
        }
      })

      if (!userFound) return res.status(404).json({ message: 'User not found' })
      
      const userWithCards = await prisma.user.findUnique({
        where: {
          id: userFound.id
        },
        select: {
          cards: {
            select: {
              quantity: true,
              card: {
                select: {
                  id: true,
                  name: true,
                  house: true,
                }
              }
            }
          }
        }
      });

      let numberCards = 0;

      userWithCards.cards.forEach(card => {
        numberCards += card.quantity;
      })

      const houses = [];

      userWithCards.cards.forEach(card => {
        if (card.card.house && !houses.includes(card.card.house)) {
          houses.push(card.card.house)
        } 
      });

      return res.status(200).json({
        cards: userWithCards.cards,
        numberCards: numberCards,
        numberHouses: houses.length
      })

    } catch (error) {
      return res.status(500).json({ message: error.message })
    }

  }

  async showUserCollection(req, res) {

    
    try {

      const userId = req.user.data.id;
      
      const usersCards = await prisma.userCard.findMany({
        where: {
          userId: userId,
        },
        select: {
          card: {
            select: {
              id: true,
              name: true,
              house: true,
              image: true
            }
          },
          quantity: true
        }
      })

      if (!usersCards) return res.status(404).json({ message: 'Not cards found' })

      return res.status(200).json(usersCards)

    } catch (error) {
      
      return res.status(500).json({ message: error.message })
    }

  }

}

export default new CardsController();