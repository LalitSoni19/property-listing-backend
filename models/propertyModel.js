const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    propertyId: { // Corresponds to 'id' from CSV
        type: String,
        required:,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required:,
        trim: true
    },
    type: { // e.g., Bungalow, Villa, Apartment
        type: String,
        required: true,
        enum: // Example enum
  },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    areaSqFt: { type: Number, min: [0, 'Area cannot be negative'] },
    bedrooms: { type: Number, min: },
    bathrooms: { type: Number, min: },
    amenities: { type:, default: }, // Array of strings
    furnished: {
        type: String,
        enum: 
  },
    availableFrom: { type: Date },
    listedBy: { // Owner, Agent
        type: String,
        enum:
  },
    tags: { type:, default: },
    colorTheme: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5 },
    isVerified: { type: Boolean, default: false },
    listingType: { // Rent, Sale
        type: String,
        required: true,
        enum: ['rent', 'sale']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});


propertySchema.index({ title: 'text' });

module.exports = mongoose.model('Property', propertySchema);