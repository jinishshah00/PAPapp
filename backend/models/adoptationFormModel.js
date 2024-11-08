import mongoose from "mongoose";

const adoptionFormSchema = mongoose.Schema({
        pet: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Pet', 
            required: true 
        },
        adopter: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        inquiry: { 
            type: String, 
            required: true 
        },
        status: { 
            type: String, 
            default: "pending" 
        },
        scheduleVisit: Date
    }, 
    { 
        timestamps: 
        true 
    }
);

const AdoptionForm = mongoose.model('AdoptionForm', adoptionFormSchema);

export default AdoptionForm;
