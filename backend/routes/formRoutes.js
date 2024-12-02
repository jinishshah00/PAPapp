import express from 'express';
import {
  createAdoptionForm,
  acceptAdoptionForm,
  rejectAdoptionForm,
  rejectAtRequestDate,
  fetchNewDates,
  setStatusToAdopted,
  getFormData,
  checkFormExists,
  getFormsAdopter,
  getFormsShelterOwner,
} from '../controllers/formController.js';
import { protect, roleCheck } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAdoptionForm); // Create an adoption form
router.get('/checkForm', checkFormExists);
router.get('/adopter', protect, getFormsAdopter); // Get all forms for the logged-in adopter
router.get('/shelter', protect, roleCheck, getFormsShelterOwner); // Get all forms for the shelter owner
router.put('/:id/accept', protect, roleCheck, acceptAdoptionForm); // Accept a form
router.put('/:id/reject', protect, roleCheck, rejectAdoptionForm); // Reject a form
router.put('/:id/reject-date', protect, roleCheck, rejectAtRequestDate); // Reject at request date
router.put('/:id/new-date', protect, fetchNewDates); // Fetch new dates
router.put('/:id/adopted', protect, roleCheck, setStatusToAdopted); // Mark as adopted
router.get('/:id', protect, getFormData); // Get form data

export default router;
