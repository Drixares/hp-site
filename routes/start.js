import express from 'express';
import AuthentificationController from '../controllers/AuthentificationController.js';
import CardsController from '../controllers/CardsController.js';
import FriendRequestsController from '../controllers/FriendRequestsController.js';
import UsersController from '../controllers/UsersController.js';
import { authentificationToken } from '../middlewares/Auth.js';

const router = express.Router();

router.post('/users/login', UsersController.login)
router.post('/users/signup', UsersController.signup)
router.post('/users/logout', UsersController.logout)
router.get('/users/getUser', authentificationToken, AuthentificationController.getUser)

router.get('/cards', CardsController.index)
router.post('/cards/create', CardsController.store)
router.get('/cards/:id', CardsController.show)

router.get('/users/cards/show', authentificationToken, CardsController.showCardFromUser)
router.post('/users/cards/add/:cardId', authentificationToken, CardsController.addCardToUser)
router.post('/users/cards/delete/:cardId', authentificationToken, CardsController.deleteCardFromUser)

router.post('/users/friendRequests/send/:receiverId', authentificationToken, FriendRequestsController.sendFriendRequest)
router.put('/users/friendRequests/accept/:requestId', authentificationToken, FriendRequestsController.acceptFriendRequest)
router.put('/users/friendRequests/decline/:requestId', authentificationToken, FriendRequestsController.declineFriendRequest)
router.delete('/users/friendRequests/cancel/:requestId', authentificationToken, FriendRequestsController.cancelFriendRequest)
router.get('/users/test', FriendRequestsController.test)

export default router;