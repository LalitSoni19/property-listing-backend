const User = require('../models/userModel');
const Property = require('../models/propertyModel');


exports.addFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const propertyId = req.params.propertyId;


        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }


        await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { favorites: propertyId } },
            { new: true }
        );
        res.json({ msg: 'Property added to favorites' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.removeFavorite = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { favorites: req.params.propertyId } },
            { new: true }
        );
        res.json({ msg: 'Property removed from favorites' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.favorites);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};