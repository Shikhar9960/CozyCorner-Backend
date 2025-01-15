import express from 'express';
<<<<<<< HEAD
import { google, signOut, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut)
=======
import  {google, signOut, signin, signup}  from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post('/google',google);
router.get('/signout',signOut)
>>>>>>> 142d5df (Initial commit)

export default router;