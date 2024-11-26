import express from 'express';
const router = express.Router();
import { protect, roleCheck } from '../middleware/authMiddleware.js';
import { createPet, deletePet, updatePet, getPet, getShelterPets, getAllPets, getDistinctValues, updatePetImage} from '../controllers/petController.js';


router.post('/createPet', protect, roleCheck, createPet);
router.put('/updatePet/:id', protect, roleCheck, updatePet);
router.delete('/deletePet/:id',protect, roleCheck, deletePet);
// router.get('/getPet', getPet);
router.get('/getPet/:id', getPet);
router.put('/updatePetImage/:id', protect, roleCheck, updatePetImage);
router.get('/getShelterPets',protect, roleCheck, getShelterPets);
router.get('/getAllPets',getAllPets);
router.get('/distinct', getDistinctValues);


export default router;
