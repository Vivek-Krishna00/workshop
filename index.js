const express = require('express');
const dotenv = require('dotenv');
const catalogRoutes = require('./routes/productRoutes');

dotenv.config();

const application = express();

application.use(express.json());

// Routes
application.use('/products', catalogRoutes);

const serverPort = process.env.PORT || 3005;
application.listen(serverPort, () => {
    console.log(`Server running http://localhost:${serverPort}/`);
});

module.exports = application;
