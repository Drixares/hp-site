import express from 'express';
import BoosterController from '../controllers/BoosterController.js';
import { authentificationToken } from '../middlewares/Auth.js';

const boosterRouter = express.Router()

// Récuperation du temps de booster, mise à jour du temps de booster, ouverture du booster
boosterRouter.get('/users/booster', authentificationToken, BoosterController.getTimer)
boosterRouter.put('/users/booster', authentificationToken, BoosterController.updateTimer)
boosterRouter.post('/users/booster/open', authentificationToken, BoosterController.openBooster)

export default boosterRouter;