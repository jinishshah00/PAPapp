import mongoose from 'mongoose';

const petSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name for the pet'],
    },
    breed: {
      type: String,
      required: [true, 'Please add a breed'],
    },
    age: {
      type: Number,
      required: [true, 'Please add the pet\'s age'],
    },
    size: {
      type: String,
      required: [true, 'Please add the size of the pet'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    medicalHistory: {
      type: String,
      default: '',
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      required: [true, 'Please add an image of the pet'],
    },
    isAdopted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Pet = mongoose.model('Pet', petSchema);

export default Pet;
