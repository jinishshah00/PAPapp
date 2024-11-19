import express from 'express';
const router = express.Router();

// create form, by initiated by adopter
// edit the form by adopter
// accept form by shelterOwner: formAdoption Model status will change to approve
// decline form totally: formAdoption Model status will change to decline
// decline for the date: : formAdoption Model status will change to temporary decline
// if status=temp, while status becomes approve/decline, keep on asking adopter for new dates
// is anything else required, ask chatgpt, any logical loophloes, if no problem just write the code


export default router;