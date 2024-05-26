const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const dbConnectionString = process.env.DB_CONNECTION_STRING;

mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Successfully connected to MongoDB.');
});

module.exports = db;
