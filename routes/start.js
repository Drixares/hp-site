import express from 'express';
import AuthentificationController from '../controllers/AuthentificationController.js';
import BoosterController from '../controllers/BoosterController.js';
import CardsController from '../controllers/CardsController.js';
import FriendRequestsController from '../controllers/FriendRequestsController.js';
import TradeController from '../controllers/TradeController.js';
import UsersController from '../controllers/UsersController.js';
import { authentificationToken } from '../middlewares/Auth.js';

const router = express.Router();

// Recherche d'utilisateur
router.post('/users/search', authentificationToken, UsersController.searchUser)

// Connexion, inscription, déconnexion et récupération de l'utilisateur
router.post('/users/login', UsersController.login)
router.post('/users/signup', UsersController.signup)
router.post('/users/logout', UsersController.logout)
router.get('/users/getUser', authentificationToken, AuthentificationController.getUser)

// Récupération des cartes, récupération d'une carte, ajout d'une carte
router.get('/cards', CardsController.index)
router.get('/cards/:id', CardsController.show)
router.post('/cards/create', CardsController.store)
router.get('/users/collection', authentificationToken, CardsController.showUserCollection)

// Récupération des cartes d'un utilisateur, ajout d'une carte à un utilisateur, suppression d'une carte d'un utilisateur
router.get('/users/cards/show', authentificationToken, CardsController.showUserCards)
router.post('/users/cards/add/:cardId', authentificationToken, CardsController.addCardToUser)
router.post('/users/cards/delete/:cardId', authentificationToken, CardsController.deleteCardFromUser)

// Envoi, acceptation, refus et annulation de demande d'ami
router.post('/users/friendRequests/send/:receiverId', authentificationToken, FriendRequestsController.sendFriendRequest)
router.put('/users/friendRequests/accept/:requestId', authentificationToken, FriendRequestsController.acceptFriendRequest)
router.put('/users/friendRequests/decline/:requestId', authentificationToken, FriendRequestsController.declineFriendRequest)
router.delete('/users/friendRequests/cancel/:requestId', authentificationToken, FriendRequestsController.cancelFriendRequest)
router.delete('/users/friendRequests/remove/:requestId', authentificationToken, FriendRequestsController.removeFriend)
// router.get('/users/test', FriendRequestsController.test)
router.get('/users/friends', authentificationToken, FriendRequestsController.getFriends)

// Récuperation du temps de booster, mise à jour du temps de booster, ouverture du booster
router.get('/users/booster', authentificationToken, BoosterController.getTimer)
router.put('/users/booster', authentificationToken, BoosterController.updateTimer)
router.post('/users/booster/open', authentificationToken, BoosterController.openBooster)

// Envoi, acceptation, refus et annulation d'échange
router.post('/users/tradeRequests/send', authentificationToken, TradeController.askTrade)
router.put('/users/tradeRequests/accept/:requestId', authentificationToken, TradeController.acceptTrade)
router.delete('/users/tradeRequests/decline/:requestId', authentificationToken, TradeController.declineTrade)
router.delete('/users/tradeRequests/cancel/:requestId', authentificationToken, TradeController.cancelTrade)
router.get('/users/tradeRequests/:requestId', authentificationToken, TradeController.seeTradeRequest)


let lastVisited = "Gryffindor";

router.get('/iot/lastVisited', (req, res) => {
  return res.json({ lastVisited: lastVisited })
})

router.post('/iot/lastVisited', (req, res) => {
  lastVisited = req.body.lastVisited
  return res.json({ lastVisited: lastVisited })
})


export default router;