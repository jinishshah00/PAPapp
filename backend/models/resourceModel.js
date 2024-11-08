import mongoose from "mongoose";

const resourceSchema = mongoose.Schema({
        title: { 
            type: String, 
            required: true 
        },
        content: { 
            type: String, 
            required: true 
        },
        lastUpdatedBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }, // Tracks the last user who edited it
    }, 
    { 
        timestamps: true 
    }
);

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
