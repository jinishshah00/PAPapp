import express from 'express';
const router = express.Router();
import { authUser, getUserProfile, logoutUser, registerUser, updateUserProfile } from '../controllers/userController.js';
import { protect, roleCheck } from '../middleware/authMiddleware.js';
import { createPet, deletePet, getAllPets, getPet, getPets, updatePet } from '../controllers/petController.js';
import { getPageFiles } from 'next/dist/server/get-page-files.js';

// create form, by initiated by adopter
router.post('/createForm', protect, createForm);
// edit the form by adopter
router.put('/editForm', protect,editForm);
// accept form by shelterOwner: formAdoption Model status will change to approve
router.put('/acceptForm', protect, acceptForm);
// decline form totally: formAdoption Model status will change to decline
router.put('/declineForm', protect, declineForm);
// decline for the date: : formAdoption Model status will change to temporary decline
router.put('/declineDate', protect, declineDate);
// if status=temp, while status becomes approve/decline, keep on asking adopter for new dates
router.put('/askNewDates', protect, askNewDates);
// is anything else required, ask chatgpt, any logical loophloes, if no problem just write the code


export default router;