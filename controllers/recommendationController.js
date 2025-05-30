const Recommendation = require('../models/recommendationModel');
const User = require('../models/userModel');
const Property = require('../models/propertyModel');


exports.createRecommendation = async (req, res) => {
    const { recipientEmail, propertyId, message } = req.body;
    const recommendingUserId = req.user.id;

    try {

        const receivingUser = await User.findOne({ email: recipientEmail });
        if (!receivingUser) {
            return res.status(404).json({ msg: 'Recipient user not found' });
        }


        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }


        if (recommendingUserId === receivingUser.id.toString()) {
            return res.status(400).json({ msg: 'Cannot recommend a property to yourself.' });
        }

        const newRecommendation = new Recommendation({
            recommendingUser: recommendingUserId,
            receivingUser: receivingUser.id,
            property: propertyId,
            message: message
        });
        await newRecommendation.save();


        await User.findByIdAndUpdate(
            receivingUser.id,
            { $addToSet: { recommendationsReceived: newRecommendation.id } }
        );



        res.status(201).json({ msg: 'Recommendation sent successfully', recommendation: newRecommendation });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.getReceivedRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'recommendationsReceived',
                populate: [
                    { path: 'recommendingUser', select: 'username email' },
                    { path: 'property' }
                ],
                options: { sort: { createdAt: -1 } }
            });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.recommendationsReceived);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};