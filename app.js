const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Property Listing API!');
});
app.use('/api/users', require('./routes/userRoutes'));


module.exports = app; 