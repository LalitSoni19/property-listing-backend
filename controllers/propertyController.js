const Property = require('../models/propertyModel');

// Create Property
exports.createProperty = async (req, res) => {
    try {
        const newPropertyData = { ...req.body, createdBy: req.user.id }; // Add createdBy from authenticated user
        const property = new Property(newPropertyData);
        await property.save();
        res.status(201).json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Properties (basic version, filtering to be added)
exports.getAllProperties = async (req, res) => {
    try {
        // Advanced filtering logic will be added here (Section V.C)
        const properties = await Property.find().populate('createdBy', 'email username'); // Populate creator info
        res.json(properties);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Property By ID
exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('createdBy', 'email username');
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }
        res.json(property);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Property not found (invalid ID format)' });
        }
        res.status(500).send('Server Error');
    }
};

// Update Property
exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        // Ownership Check: Ensure only the creator can update
        if (property.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true } // Return updated doc, run schema validators
        );
        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        // Ownership Check: Ensure only the creator can delete
        if (property.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Property.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Property removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};