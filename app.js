const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('This is the Blank API.');
});
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));


module.exports = app; 