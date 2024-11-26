import asyncHandler from "express-async-handler";
import Pet from "../models/petModel.js";
import multer from "multer";
import path from "path";
import fs from 'fs';

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public/img")); // Save images to the src folder
  },
  filename: (req, file, cb) => {
    const petName = req.body.name.replace(/\s+/g, "").toLowerCase();
    cb(null, `${petName}img${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Images only!"));
    }
  },
});

const uploadSingle = upload.single("image");

// @desc Create a new pet
// @route POST /api/pet/createPet
// @access Private
const createPet = asyncHandler(async (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      res.status(400);
      throw new Error(err.message);
    }

    const { name, breed, age, size, location, medicalHistory } = req.body;

    if (!req.file) {
      res.status(400);
      throw new Error("Image is required for the pet");
    }

    const petExists = await Pet.findOne({ name, shelter: req.user._id });
    if (petExists) {
      res.status(400);
      throw new Error("Pet already exists in your shelter");
    }

    const imagePath = `/img/${req.file.filename}`;

    const pet = await Pet.create({
      name,
      breed,
      age,
      size,
      location,
      medicalHistory,
      image: imagePath,
      shelter: req.user._id,
    });

    if (pet) {
      res.status(201).json(pet);
    } else {
      res.status(400);
      throw new Error("Invalid pet data");
    }
  });
});

// @desc Update a pet's image
// @route PUT /api/pets/updatePetImage/:id
// @access Private
const updatePetImage = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    res.status(404);
    throw new Error("Pet not found");
  }

  // Process image upload using multer
  uploadSingle(req, res, async (err) => {
    if (err) {
      res.status(400);
      throw new Error(err.message);
    }

    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided");
    }

    try {
      const updatedPet = await pet.save();

      res.status(200).json({
        message: "Image updated successfully",
        image: updatedPet.image,
      });
    } catch (error) {
      res.status(500);
      throw new Error("An error occurred while updating the pet image");
    }
  });
});


// @desc Get a specific pet by ID
// @route GET /api/pets/getPet
// @access Public
const getPet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id).populate('shelter', 'name email');

  if (pet) {
    res.status(200).json(pet);
  } else {
    res.status(404);
    throw new Error("Pet not found");
  }
});

// @desc Update a specific pet by ID
// @route PUT /api/pets/updatePet
// @access Private
const updatePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (pet) {
    pet.name = req.body.name || pet.name;
    pet.breed = req.body.breed || pet.breed;
    pet.age = req.body.age || pet.age;
    pet.size = req.body.size || pet.size;
    pet.location = req.body.location || pet.location;
    pet.medicalHistory = req.body.medicalHistory || pet.medicalHistory;

    // Update image if provided
    uploadSingle(req, res, async (err) => {
      if (err) {
        res.status(400);
        throw new Error(err.message);
      }

      if (req.file) {
        pet.image = `img/${req.file.filename}`;
      }

      const updatedPet = await pet.save();
      res.status(200).json(updatedPet);
    });
  } else {
    res.status(404);
    throw new Error("Pet not found");
  }
});

// @desc Delete a specific pet by ID
// @route DELETE /api/pets/deletePet/:id
// @access Private
const deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (pet) {
    // Construct the full path of the image
    const imagePath = path.join(process.cwd(), 'public', pet.image);

    // Delete the pet document from the database
    await Pet.deleteOne({ _id: req.params.id });

    // Attempt to delete the image file
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Failed to delete image: ${imagePath}. Error: ${err.message}`);
        // Not throwing an error here to allow the pet deletion to proceed
      }
    });

    res.status(200).json({ message: "Pet and associated image deleted successfully" });
  } else {
    res.status(404); // Send not found response if pet doesn't exist
    throw new Error("Pet not found");
  }
});

// @desc Get all pets for the authenticated shelter owner
// @route GET /api/pets/getShelterPets
// @access Private
const getShelterPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ shelter: req.user._id });

  if (pets.length > 0) {
    res.status(200).json(pets);
  } else {
    res.status(404).json({ message: "No pets found for your shelter" });
  }
});

// @desc Get all available pets for adoption
// @route GET /api/pets/getAllPets
// @access Public
const getAllPets = asyncHandler(async (req, res) => {
  try {
    const { breed, age, size, location } = req.query;

    const query = {};
    if (breed) query.breed = { $regex: breed, $options: 'i' };
    if (age) query.age = age;
    if (size) query.size = size;
    if (location) query.location = { $regex: location, $options: 'i' };

    const pets = await Pet.find({ ...query, isAdopted: false });

    if (pets.length > 0) {
      res.status(200).json(pets);
    } else {
      res.status(404).json({ message: 'No pets found matching the criteria' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pets', error });
  }
});

// @desc Get distinct values for filters
// @route GET /api/pets/distinct
// @access Public
const getDistinctValues = asyncHandler(async (req, res) => {
  try {
    const breeds = await Pet.distinct('breed', { isAdopted: false });
    const ages = await Pet.distinct('age', { isAdopted: false });
    const locations = await Pet.distinct('location', { isAdopted: false });

    res.status(200).json({ breeds, ages, locations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching filter options', error });
  }
});

export {
  createPet,
  updatePet,
  deletePet,
  getPet,
  getShelterPets,
  getAllPets,
  getDistinctValues,
  updatePetImage,
};
