import express from 'express';
import boosterRouter from './Booster.route.js';
import cardsRouter from './Cards.route.js';
import friendsRouter from './Friends.route.js';
import tradeRouter from './Trade.router.js';
import usersRouter from './Users.route.js';

const router = express.Router();

router.use('/', usersRouter)
router.use('/', cardsRouter)
router.use('/', friendsRouter)
router.use('/', boosterRouter)
router.use('/', tradeRouter)


// ----------- IOT Routes for Raspberry Pi ----------- //

let lastVisited = "Gryffindor";

router.get('/iot/lastVisited', (req, res) => {
  return res.json({ lastVisited: lastVisited })
})

router.post('/iot/lastVisited', (req, res) => {
  lastVisited = req.body.lastVisited
  return res.json({ lastVisited: lastVisited })
})


export default router;