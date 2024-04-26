import prisma from "../config/prisma.js";

class BoosterController {

  async getTimer(req, res) {
    
    try {
      
      const userId = req.user.data.id;

      const lastBooster = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          booster: true,
        }

      })

      if (!lastBooster) return res.status(404).json({ message: "Booster not found"});

      return res.status(200).json({next_booster: parseInt(lastBooster.booster)});

    } catch (error) {
      
      return res.status(500).json({ message: error.message });
    }
  }

  async updateTimer(req, res) {

    try {
      
      const userEmail = req.user.data.email;
      // const nextBooster = Date.now() + 1000 * 60 * 60 * 24
      const nextBooster = Date.now() + 1000 * 3
      console.log(nextBooster);
      
      const lastBooster = await prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          booster: nextBooster.toString(),
        }
      })

      if (!lastBooster) return res.status(404).json({ message: "Booster not found"});

      return res.status(200).json({ message: "Booster updated", next_booster: lastBooster.booster });

    } catch (error) {
      
      return res.status(500).json({ message: error.message });
    }
  }

  async openBooster(req, res) {

    try {

      let cards = [];
      const userEmail = req.user.data.email;

      // Get all cards id
      const cardsID = await prisma.card.findMany({
        select: {
          id: true,
        }
      })

      if (!cardsID) return res.status(404).json({ message: "No cards in the database..."});


      for (let i = 0; i < 5; i++) {
        
        const randomCard = cardsID[Math.floor(Math.random() * cardsID.length)];

        // Check if user already has the card
        const userHasCard = await prisma.user.findFirst({
          where: {
            email: userEmail,
            cards: {
              some: {
                cardId: randomCard.id
              }
            }
          }
        })

        if (userHasCard) {
          await prisma.userCard.update({
            where: {
              userId_cardId: {
                userId: userHasCard.id,
                cardId: randomCard.id
              }
            },
            data: {
              quantity: {
                increment: 1
              }
            }
          })

          cards.push(randomCard.id);
          continue;

        } else {

          await prisma.user.update({
            where: {
              email: userEmail,
            },
            data: {
              cards: {
                create: {
                  cardId: randomCard.id
                }
              }
            }
          })

        }   

        cards.push(randomCard.id);
      }

      let allCards = [];

      for (const card of cards) {
        const cardInfo = await prisma.card.findUnique({
          where: {
            id: card
          },
          select: {
            id: true,
            name: true,
            actor: true,
            image: true,
            house: true,
          }
        });

        allCards.push(cardInfo);
      }

      // Update booster timer
      const nextBooster = Date.now() + 1000 * 60 * 60 * 24
      await prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          booster: nextBooster.toString(),
        }
      })

      return res.status(200).json({ cards: allCards, next_booster: nextBooster});


    } catch (error) {
      
      return res.status(500).json({ message: error.message });
    }
  }

}

export default new BoosterController();