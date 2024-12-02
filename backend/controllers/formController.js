import asyncHandler from 'express-async-handler';
import AdoptionForm from '../models/adoptationFormModel.js';
import Pet from '../models/petModel.js';

// Create a new adoption form
const createAdoptionForm = asyncHandler(async (req, res) => {
    const { pet, adopter, inquiry, scheduleVisit } = req.body;

    // Check if the user already submitted for this pet
    const existingForm = await AdoptionForm.findOne({ pet, adopter });
    if (existingForm) {
        if (existingForm.status === 'rejected') {
            res.status(400);
            throw new Error('You have been rejected for this pet. Cannot re-submit.');
        }
        res.status(400);
        throw new Error('You have already requested adoption for this pet.');
    }

    const adoptUser = req.user._id;
    const form = new AdoptionForm({
        pet,
        adopter: adoptUser,
        inquiry,
        scheduleVisit,
    });

    const createdForm = await form.save();
    res.status(201).json(createdForm);
});

// Accept a form
const acceptAdoptionForm = asyncHandler(async (req, res) => {
    const form = await AdoptionForm.findById(req.params.id);

    if (!form) {
        res.status(404);
        throw new Error('Form not found');
    }

    form.status = 'accepted';
    const updatedForm = await form.save();
    res.json(updatedForm);
});

// Reject a form
const rejectAdoptionForm = asyncHandler(async (req, res) => {
    const form = await AdoptionForm.findById(req.params.id);

    if (!form) {
        res.status(404);
        throw new Error('Form not found');
    }

    form.status = 'rejected';
    const updatedForm = await form.save();
    res.json(updatedForm);
});

// Reject form at the requested date
const rejectAtRequestDate = asyncHandler(async (req, res) => {
    const form = await AdoptionForm.findById(req.params.id);

    if (!form) {
        res.status(404);
        throw new Error('Form not found');
    }

    form.status = 'rescheduled';
    const updatedForm = await form.save();
    res.json(updatedForm);
});

// Fetch new dates from adopter
const fetchNewDates = asyncHandler(async (req, res) => {
    const form = await AdoptionForm.findById(req.params.id);
    console.log(form);

    if (!form || form.status !== 'rescheduled') {
        res.status(400);
        throw new Error('Invalid form or status does not allow this operation');
    }

    form.scheduleVisit = req.body.newDate;
    form.status = 'pending';
    const updatedForm = await form.save();
    res.json(updatedForm);
});

// Mark as adopted
const setStatusToAdopted = asyncHandler(async (req, res) => {
  const formId = req.params.id;

  // Find the form and its associated pet
  const form = await AdoptionForm.findById(formId).populate('pet');
  if (!form) {
    res.status(404);
    throw new Error('Form not found');
  }

  // Check if the pet is already adopted
  if (form.pet.isAdopted) {
    res.status(400);
    throw new Error('This pet has already been adopted.');
  }

  // Mark the pet as adopted
  const pet = await Pet.findById(form.pet._id);
  pet.isAdopted = true;
  await pet.save();

  // Update the status of the current form to "adopted"
  form.status = 'adopted';
  await form.save();

  // Decline all other forms for this pet
  await AdoptionForm.updateMany(
    { pet: form.pet._id, _id: { $ne: formId } }, // Exclude the current form
    { $set: { status: 'rejected' } }
  );

  res.status(200).json({ message: 'Pet adopted and other forms declined successfully.' });
});

// Fetch form data for adopters and shelter owners
const getFormData = asyncHandler(async (req, res) => {
  const formId = req.params.id;

  const form = await AdoptionForm.findById(formId)
    .populate({
      path: 'pet',
      populate: {
        path: 'shelter', // Populate the shelter field within the pet
        select: 'name email', // Select only the necessary fields
      },
    })
    .populate('adopter', 'name email'); // Populate adopter's name and email

  if (!form) {
    res.status(404);
    throw new Error('Form not found');
  }

  res.json(form);
});


const checkFormExists = asyncHandler(async (req, res) => {
    try {
      const { pet, adopter } = req.query;
  
      // Validate query parameters
      if (!pet || !adopter) {
        console.error('Missing pet or adopter ID in query parameters.');
        return res.status(400).json({ message: 'Pet ID and Adopter ID are required.' });
      }
  
      // Check if the form exists
      const formExists = await AdoptionForm.exists({ pet, adopter });
  
      // Return the result
      return res.status(200).json({ exists: !!formExists });
    } catch (error) {
      console.error('Error checking form existence:', error);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  

  const getFormsAdopter = asyncHandler(async (req, res) => {
    try {
      const adopterId = req.user._id; // Get the adopter's ID from the authenticated user
  
      const forms = await AdoptionForm.find({ adopter: adopterId })
        .populate('pet', 'name breed age image shelter') // Correctly populate the 'shelter' field
        .populate('adopter', 'name email'); // Populate adopter details
  
      res.status(200).json(forms);
    } catch (error) {
      console.error('Error fetching adopter forms:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  
  
  
  const getFormsShelterOwner = asyncHandler(async (req, res) => {
    try {
      const shelterOwnerId = req.user._id; // Get the shelter owner's ID from the authenticated user
  
      // Fetch forms and populate pets
      const forms = await AdoptionForm.find()
        .populate({
          path: 'pet',
          match: { shelter: shelterOwnerId }, // Use 'shelter' field from the Pet schema
          select: 'name breed age image shelter', // Fields to populate for the pet
        })
        .populate('adopter', 'name email'); // Populate adopter details
  
      // Filter out forms where the pet is null or doesn't match the shelter owner
      const filteredForms = forms.filter((form) => form.pet !== null);
  
      res.status(200).json(filteredForms);
    } catch (error) {
      console.error('Error fetching shelter owner forms:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });  

  // Get forms with status 'adopted' for a specific shelter owner
const getAdoptedFormsForShelterOwner = asyncHandler(async (req, res) => {
  try {
    const shelterOwnerId = req.user._id; // Get the shelter owner's ID from the authenticated user

    // Fetch forms with 'adopted' status and populate related data
    const adoptedForms = await AdoptionForm.find({ status: 'adopted' })
      .populate({
        path: 'pet',
        match: { shelter: shelterOwnerId }, // Ensure the pet belongs to the shelter owner
        select: 'name breed age image shelter', // Fields to populate for the pet
      })
      .populate('adopter', 'name email'); // Populate adopter details

    // Filter out forms where the pet does not belong to the current shelter owner
    const filteredForms = adoptedForms.filter((form) => form.pet !== null);

    res.status(200).json(filteredForms);
  } catch (error) {
    console.error('Error fetching adopted forms:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

  
export {
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
    getAdoptedFormsForShelterOwner,
};
