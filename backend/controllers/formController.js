import asyncHandler from "express-async-handler";
import Pet from "../models/petModel.js";
import generateToken from "../utils/generateToken.js";
import AdoptionForm from "../models/adoptationFormModel.js";

// @desc Create a new adoption form
// route POST /api/form/createForm
// @access Private
const createForm = asyncHandler(async (req, res) => {
    const { petId, inquiry, scheduleVisit } = req.body;
    const pet = await Pet.findById(petId);
    if (!pet) {
        res.status(400);
        throw new Error('Pet not found');
    }
    const form = await AdoptionForm.create({
        pet: petId,
        adopter: req.user._id,
        inquiry,
        scheduleVisit
    });
    if (form) {
        res.status(201).json({
            _id: form._id,
            pet: form.pet,
            adopter: form.adopter,
            inquiry: form.inquiry,
            scheduleVisit: form.scheduleVisit,
            status: form.status
        });
    } else {
        res.status(400);
        throw new Error('Invalid form data');
    }
});
// edit the form by adopter
// route PUT /api/form/editForm
// @access Private
const editForm = asyncHandler(async (req, res) => {
    const { petId, inquiry, scheduleVisit } = req.body;
    const form = await AdoptionForm.findOne({ adopter: req.user._id, pet: petId });
    if (!form) {
        res.status(404);
        throw new Error('Form not found');
    }
    form.inquiry = inquiry;
    form.scheduleVisit = scheduleVisit;
    const updatedForm = await form.save();
    res.json({
        _id: updatedForm._id,
        pet: updatedForm.pet,
        adopter: updatedForm.adopter,
        inquiry: updatedForm.inquiry,
        scheduleVisit: updatedForm.scheduleVisit,
        status: updatedForm.status
    });
});
// accept form by shelterOwner: formAdoption Model status will change to approve
// route PUT /api/form/acceptForm
// @access Private
const acceptForm = asyncHandler(async (req, res) => {
    const { formId } = req.body;
    const form = await AdoptionForm
        .findById(formId)
        .populate('pet');
    if (!form) {
        res.status(404);
        throw new Error('Form not found');
    }
    form.status = 'approve';
    form.scheduleVisit = new Date();
    const updatedForm = await form.save();
    res.json({
        _id: updatedForm._id,
        pet: updatedForm.pet,
        adopter: updatedForm.adopter,
        inquiry: updatedForm.inquiry,
        scheduleVisit: updatedForm.scheduleVisit,
        status: updatedForm.status
    });
    
});
// decline form totally: formAdoption Model status will change to decline
// route PUT /api/form/declineForm
// @access Private
const declineForm = asyncHandler(async (req, res) => {
    const { formId } = req.body;
    const form = await AdoptionForm
        .findById(formId)
        .populate('pet');   
    if (!form) {
        res.status(404);
        throw new Error('Form not found');
    }
    form.status = 'decline';
    form.scheduleVisit = null;
    const updatedForm = await form.save();
    res.json({
        _id: updatedForm._id,
        pet: updatedForm.pet,
        adopter: updatedForm.adopter,
        inquiry: updatedForm.inquiry,
        scheduleVisit: updatedForm.scheduleVisit,
        status: updatedForm.status
    });
});

// decline for the date: : formAdoption Model status will change to temporary decline
// route PUT /api/form/declineDate
// @access Private
const declineDate = asyncHandler(async (req, res) => {
    const { formId } = req.body;
    const form = await AdoptionForm
        .findById(formId)
        .populate('pet');   
    if (!form) {
        res.status(404);
        throw new Error('Form not found');
    }
    form.status = 'temp';
    form.scheduleVisit = null;
    const updatedForm = await form.save();
    res.json({
        _id: updatedForm._id,
        pet: updatedForm.pet,
        adopter: updatedForm.adopter,
        inquiry: updatedForm.inquiry,
        scheduleVisit: updatedForm.scheduleVisit,
        status: updatedForm.status
    });
});
// if status=temp, while status becomes approve/decline, keep on asking adopter for new dates
// route PUT /api/form/askNewDates
// @access Private
const askNewDates = asyncHandler(async (req, res) => {
    const { formId, scheduleVisit } = req.body;
    const form = await AdoptionForm
        .findById(formId)
        .populate('pet');   
    if (!form) {
        res.status(404);
        throw new Error('Form not found');
    }
    form.status = 'pending';
    form.scheduleVisit = scheduleVisit;
    const updatedForm = await form.save();
    res.json({
        _id: updatedForm._id,
        pet: updatedForm.pet,
        adopter: updatedForm.adopter,
        inquiry: updatedForm.inquiry,
        scheduleVisit: updatedForm.scheduleVisit,
        status: updatedForm.status
    });
});
// is anything else required, ask chatgpt, any logical loophloes, if no problem just write the code
export { 
    createForm,
    editForm,
    acceptForm,
    declineForm,
    declineDate,
    askNewDates
};