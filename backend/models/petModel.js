import mongoose from "mongoose";

const petSchema = mongoose.Schema({
        name: { 
            type: String, 
            required: true 
        },
        breed: { 
            type: String, 
            required: true 
        },
        age: { 
            type: Number, 
            required: true 
        },
        size: { 
            type: String, 
            required: true 
        },
        location: { 
            type: String, 
            required: true 
        },
        medicalHistory: String,
        shelter: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        }
    }, 
    {   
        timestamps: true 
    }
);

const Pet = mongoose.model('Pet', petSchema);

export default Pet;