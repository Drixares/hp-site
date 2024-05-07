import express from 'express';
import AuthentificationController from "../controllers/AuthentificationController.js";
import UsersController from "../controllers/UsersController.js";
import { authentificationToken } from '../middlewares/Auth.js';

const usersRouter = express.Router()

// Recherche d'utilisateur
usersRouter.post('/users/search', authentificationToken, UsersController.searchUser)

// Connexion, inscription, déconnexion et récupération de l'utilisateur
usersRouter.post('/users/login', UsersController.login)
usersRouter.post('/users/signup', UsersController.signup)
usersRouter.post('/users/logout', UsersController.logout)
usersRouter.get('/users/getUser', authentificationToken, AuthentificationController.getUser)

export default usersRouter;