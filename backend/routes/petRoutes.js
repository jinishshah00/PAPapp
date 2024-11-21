import express from 'express';
const router = express.Router();
// import { authUser, getUserProfile, logoutUser, registerUser, updateUserProfile } from '../controllers/userController.js';
import { protect, roleCheck } from '../middleware/authMiddleware.js';
import { createPet, deletePet, getAllPets, getPet, getPets, updatePet } from '../controllers/petController.js';
// import { getPageFiles } from 'next/dist/server/get-page-files.js';

router.post('/createPet', protect, roleCheck, createPet);
router.put('/updatePet', protect, roleCheck, updatePet);
router.get('/getPet', getPet);
router.delete('/deletePet',protect, roleCheck, deletePet);
router.get('/getAllPets',protect, roleCheck, getAllPets);
router.get('/getPets',getPets);

export default router;
