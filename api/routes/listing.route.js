import express from 'express';
<<<<<<< HEAD
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
=======
import { verifyToken } from '../utils/verifyUser.js';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js'

>>>>>>> 142d5df (Initial commit)

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;