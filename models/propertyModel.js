const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    propertyId: { // Corresponds to 'id' from CSV
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Bungalow', 'Villa', 'Apartment', 'Studio', 'Penthouse']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    areaSqFt: { type: Number, min: [0, 'Area cannot be negative'] },
    bedrooms: { type: Number, min: [0, 'Bedroom cannot be negative'] },
    bathrooms: { type: Number, min: [0, 'Bathroom cannot be negative'] },
    amenities: { type: [String], default: [] },
    furnished: {
        type: String,
        enum: ['Furnished', 'Unfurnished', 'Semi'],
        default: 'Unfurnished'
    },
    availableFrom: { type: Date },
    listedBy: {
        type: String,
        enum: ['Owner', 'Agent', 'Builder'],
        default: 'Owner'
    },
    tags: { type: [String], default: [] },
    colorTheme: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5 },
    isVerified: { type: Boolean, default: false },
    listingType: {
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