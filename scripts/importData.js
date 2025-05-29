const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Property = require('../models/propertyModel');
const connectDB = require('../config/db');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const importData = async () => {
    await connectDB();

    const results = [];
    const filePath = path.join(__dirname, '../data/db424fd9fb74_1748258398689.csv');

    // const defaultUserId = new mongoose.Types.ObjectId(); // Example placeholder

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            // Transform CSV data to match the Property schema
            const transformedData = {
                propertyId: data.id, // Map 'id' from CSV to 'propertyId'
                title: data.title,
                type: data.type,
                price: parseFloat(data.price),
                state: data.state,
                city: data.city,
                areaSqFt: parseInt(data.areaSqFt, 10),
                bedrooms: parseInt(data.bedrooms, 10),
                bathrooms: parseInt(data.bathrooms, 10),
                amenities: data.amenities ? data.amenities.split('|').map(item => item.trim()).filter(item => item) : [],
                furnished: data.furnished,
                availableFrom: data.availableFrom ? new Date(data.availableFrom) : null,
                listedBy: data.listedBy,
                tags: data.tags ? data.tags.split('|').map(item => item.trim()).filter(item => item) : [],
                colorTheme: data.colorTheme,
                rating: parseFloat(data.rating),
                isVerified: data.isVerified ? data.isVerified.toLowerCase() === 'true' : false,
                listingType: data.listingType,
                // createdBy: defaultUserId, // Assign a default/system user ID for imported properties

                createdBy: new mongoose.Types.ObjectId() // Placeholder - replace with actual logic
            };
            results.push(transformedData);
        })
        .on('end', async () => {
            try {
                // Clear existing properties to avoid duplicates on re-run (optional)
                // await Property.deleteMany({}); 
                // console.log('Existing properties cleared.');

                await Property.insertMany(results);
                console.log('Data Imported Successfully to MongoDB!');
            } catch (error) {
                console.error('Error inserting data to MongoDB:', error);
            } finally {
                mongoose.connection.close();
            }
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            mongoose.connection.close();
        });
};

importData();