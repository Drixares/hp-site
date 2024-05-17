import express from 'express';
import CardsController from '../controllers/CardsController.js';
import { authentificationToken } from '../middlewares/Auth.js';

const cardsRouter = express.Router()


// Récupération des cartes, récupération d'une carte, ajout d'une carte
cardsRouter.get('/cards', CardsController.index)
cardsRouter.get('/cards/:id', CardsController.show)
cardsRouter.post('/cards/create', CardsController.store)
cardsRouter.get('/users/collection', authentificationToken, CardsController.showUserCollection)
cardsRouter.put('/users/cards/favorite/:cardId', authentificationToken, CardsController.changeFovoriteCard)

// Récupération des cartes d'un utilisateur, ajout d'une carte à un utilisateur, suppression d'une carte d'un utilisateur
cardsRouter.get('/users/cards/show', authentificationToken, CardsController.showUserCards)
cardsRouter.post('/users/cards/add/:cardId', authentificationToken, CardsController.addCardToUser)
cardsRouter.post('/users/cards/delete/:cardId', authentificationToken, CardsController.deleteCardFromUser)

export default cardsRouter;