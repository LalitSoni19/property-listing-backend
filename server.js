const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();


connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
});