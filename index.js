const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
const routes = require('./routes');

app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));


app.use('/api', routes);

// Database connection
require('./config/db.config');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
