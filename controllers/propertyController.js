const Property = require('../models/propertyModel');
const redisClient = require('../config/redisClient');
const DEFAULT_EXPIRATION = 3600;


exports.createProperty = async (req, res) => {
    try {
        const newPropertyData = { ...req.body, createdBy: req.user.id };
        const property = new Property(newPropertyData);
        await property.save();
        res.status(201).json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



exports.getAllProperties = async (req, res) => {
    try {
        const query = {};
        const {
            type, state, city, bedrooms, bathrooms, furnished, listingType, isVerified, listedBy,
            price_min, price_max, areaSqFt_min, areaSqFt_max, rating_min, rating_max,
            search_title,
            amenities_in,
            tags_all,
            sortBy, order = 'asc', page = 1, limit = 10
        } = req.query;


        if (type) query.type = type;
        if (state) query.state = state;
        if (city) query.city = city;

        const parsedBedrooms = parseInt(bedrooms, 10);
        if (!Number.isNaN(parsedBedrooms)) query.bedrooms = parsedBedrooms;

        const parsedBathrooms = parseInt(bathrooms, 10);
        if (!Number.isNaN(parsedBathrooms)) query.bathrooms = parsedBathrooms;

        if (furnished !== undefined) query.furnished = furnished === 'true';
        if (listingType) query.listingType = listingType;
        if (isVerified !== undefined) query.isVerified = isVerified === 'true';
        if (listedBy) query.listedBy = listedBy;


        const priceQuery = {};
        if (price_min) priceQuery.$gte = parseFloat(price_min);
        if (price_max) priceQuery.$lte = parseFloat(price_max);
        if (Object.keys(priceQuery).length > 0) query.price = priceQuery;

        const areaQuery = {};
        if (areaSqFt_min) areaQuery.$gte = parseInt(areaSqFt_min, 10);
        if (areaSqFt_max) areaQuery.$lte = parseInt(areaSqFt_max, 10);
        if (Object.keys(areaQuery).length > 0) query.areaSqFt = areaQuery;

        const ratingQuery = {};
        if (rating_min) ratingQuery.$gte = parseFloat(rating_min);
        if (rating_max) ratingQuery.$lte = parseFloat(rating_max);
        if (Object.keys(ratingQuery).length > 0) query.rating = ratingQuery;


        if (search_title) {
            query.$text = { $search: search_title };
        }


        if (amenities_in) {
            query.amenities = {
                $in: amenities_in.split(',').map(item => item.trim())
            };
        }


        if (tags_all) {
            query.tags = {
                $all: tags_all.split(',').map(item => item.trim())
            };
        }


        const pageNum = Math.max(parseInt(page, 10), 1);
        const limitNum = Math.max(parseInt(limit, 10), 1);
        const skip = (pageNum - 1) * limitNum;


        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1;
        }


        const properties = await Property.find(query)
            .populate('createdBy', 'email username')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalProperties = await Property.countDocuments(query);

        res.json({
            properties,
            currentPage: pageNum,
            totalPages: Math.ceil(totalProperties / limitNum),
            totalProperties
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};






exports.getPropertyById = async (req, res) => {
    const propertyId = req.params.id;
    const cacheKey = `property:${propertyId}`;

    try {
        if (redisClient.isOpen) {
            try {
                const cachedProperty = await redisClient.get(cacheKey);
                if (cachedProperty) {
                    console.log('Cache HIT for property:', propertyId);
                    return res.json(JSON.parse(cachedProperty));
                }
            } catch (redisErr) {
                console.error('Redis GET error:', redisErr);
            }
        }

        console.log('Cache MISS for property:', propertyId);
        const property = await Property.findById(propertyId).populate('createdBy', 'email username');

        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        // Save to cache
        if (redisClient.isOpen) {
            try {
                await redisClient.set(cacheKey, JSON.stringify(property.toObject()), {
                    EX: DEFAULT_EXPIRATION
                });
            } catch (redisErr) {
                console.error('Redis SET error:', redisErr);
            }
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

exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }


        if (property.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }


        property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );


        if (redisClient.isOpen) {
            try {
                await redisClient.del(`property:${req.params.id}`);
                console.log(`Cache invalidated for property: ${req.params.id}`);
            } catch (redisErr) {
                console.error('Redis DEL error after update:', redisErr);
            }
        }

        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// 
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }


        if (property.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Property.findByIdAndDelete(req.params.id);


        if (redisClient.isOpen) {
            try {
                await redisClient.del(`property:${req.params.id}`);
                console.log(`Cache invalidated for property: ${req.params.id}`);
            } catch (redisErr) {
                console.error('Redis DEL error after delete:', redisErr);
            }
        }

        res.json({ msg: 'Property removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
