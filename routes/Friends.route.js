import express from 'express';
import FriendRequestsController from '../controllers/FriendRequestsController.js';
import { authentificationToken } from '../middlewares/Auth.js';


const friendsRouter = express.Router()

// Envoi, acceptation, refus et annulation de demande d'ami
friendsRouter.post('/users/friendRequests/send/:receiverId', authentificationToken, FriendRequestsController.sendFriendRequest)
friendsRouter.put('/users/friendRequests/accept/:requestId', authentificationToken, FriendRequestsController.acceptFriendRequest)
friendsRouter.put('/users/friendRequests/decline/:requestId', authentificationToken, FriendRequestsController.declineFriendRequest)
friendsRouter.delete('/users/friendRequests/cancel/:requestId', authentificationToken, FriendRequestsController.cancelFriendRequest)
friendsRouter.delete('/users/friendRequests/remove/:requestId', authentificationToken, FriendRequestsController.removeFriend)
friendsRouter.get('/users/friends', authentificationToken, FriendRequestsController.getFriends)
// friendsRouter.get('/users/test', FriendRequestsController.test)

export default friendsRouter;