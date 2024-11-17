import asyncHandler from "express-async-handler";
import Pet from "../models/petModel.js";
import generateToken from "../utils/generateToken.js";


// @desc Create a new pet
// route POST /api/pet/createPet
// @access Private
const createPet = asyncHandler(async (req, res) => {
    const { name, breed, age, size, location, medicalHistory, shelter} = req.body;
    const petExists = await Pet.findOne({ name });
    if (petExists) {
        res.status(400);
        throw new Error('Pet already exists');
    }
    const pet = await Pet.create({
        name,
        breed,
        age,
        size,
        location,
        medicalHistory,
        shelter
    });

    if (pet) {
        generateToken(res, pet._id);
        res.status(201).json({
            _id: pet._id,
            name: pet.name,
            breed: pet.breed,
            age: pet.age,
            size: pet.size,
            location: pet.location,
            medicalHistory: pet.medicalHistory,
            shelter: pet.shelter
        });
    } else {
        res.status(400);
        throw new Error('Invalid pet data');
    }
});

// @desc Get user profile
// route GET /api/users/profile
// @access Public
const getPet = asyncHandler(async (req, res) => {
    const pet = {
        _id: req.pet._id,
        name: req.pet.name,
        breed: pet.breed,
        age: pet.age,
        size: pet.size,
        location: pet.location,
        medicalHistory: pet.medicalHistory,
        shelter: pet.shelter    
    };
    res.status(200).json({ pet });
});

// @desc Update pet profile
// route PUT /api/pets/updatePet
// @access Private
const updatePet = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.pet._id);

    if (pet) {
        pet.name = req.body.name || pet.name;
        pet.breed = req.body.breed ||pet.breed,
        pet.age = req.body.age ||pet.age,
        pet.size = req.body.size ||pet.size,
        pet.location = req.body.loaction ||pet.location,
        pet.medicalHistory = req.body.medicalHistory ||pet.medicalHistory,
        pet.shelter = req.body.shleter ||pet.shelter
        const updatedPet = await pet.save();
        res.status(200).json({
            _id: updatedPet._id,
            name: updatedPet.name,
            breed: updatedPet.breed,
            age: updatedPet.age,
            size: updatedPet.size,
            location: updatedPet.location,
            medicalHistory: updatedPet.medicalHistory,
            shelter: updatedPet.shelter
        });
    } else {
        res.status(404);
        throw new Error('Pet not found');
    }
});

// @desc Delete pet profile
// route PUT /api/pets/deletePet
// @access Private
const deletePet = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.pet._id);
    if (pet){
        //delete the pet
        await pet.remove();
        res.json({ message: 'Pet deleted successfully' });
    } else{
        res.status(404);
        throw new Error('Pet not found');
    }
});

// @desc get all created pets
// route PUT /api/pets/getAllPets
// @access Private used only shelterOwner
// get all of the pets ever created whether adopted or available for the given shleter
const getAllPets = asyncHandler(async (req,res) => {
    const pets = await Pet.find({ shelter: req.user._id });//which mongoDB method to use to get array of all the 
                    //created pets ever for given shelter
                    // return array as response
                    // error handling just like above methods
    res.json(pets);
});
// @desc get all available pets
// route PUT /api/pets/getPets
// @access Public
// get all available pets, available for adoption for the given shelter, used by adopter or shelter owner (GET)
const getPets = asyncHandler(async (req,res) => {
    try {
        const { shelterId } = req.params;
    
        const pets = await Pet.find({ shelter: shelterId });
    
        res.json(pets);
      } catch (error) {
        res.status(500).json({ message: 'Error getting available pets', error });
      }
});

export { 
    createPet,
    updatePet,
    getPet,
    deletePet,
    getAllPets,
    getPets
};
