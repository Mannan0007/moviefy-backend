import express from 'express';
import { registerUser, loginUser, addToWatchlist, getWatchlist, markAsWatched } from '../Controllers/userController.js';

import protect from '../middlewere/protect.js';
import { deleteFromWatchlist } from '../Controllers/moviesController.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/add', protect, addToWatchlist);
userRouter.get("/watchlist", protect, getWatchlist);
userRouter.put("/watchlist/mark-watched", protect, markAsWatched);
userRouter.delete('/watchlist/delete', protect, deleteFromWatchlist);


export default userRouter;