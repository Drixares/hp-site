import express from 'express';
import TradeController from '../controllers/TradeController.js';
import { authentificationToken } from '../middlewares/Auth.js';

const tradeRouter = express.Router()

// Envoi, acceptation, refus et annulation d'échange
tradeRouter.post('/users/tradeRequests/send', authentificationToken, TradeController.askTrade)
tradeRouter.put('/users/tradeRequests/accept/:requestId', authentificationToken, TradeController.acceptTrade)
tradeRouter.delete('/users/tradeRequests/decline/:requestId', authentificationToken, TradeController.declineTrade)
tradeRouter.delete('/users/tradeRequests/cancel/:requestId', authentificationToken, TradeController.cancelTrade)
tradeRouter.get('/users/tradeRequests/:requestId', authentificationToken, TradeController.seeTradeRequest)

export default tradeRouter;