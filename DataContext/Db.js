const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
//mongodb connection string
const mongoString =process.env.MongoDB_URI

mongoose.set('strictQuery', false)
mongoose.connect(mongoString);

const database = mongoose.connection;

const connectToMongo = () => {
    database.on('error', (error) => {
        console.log(error)
    })
    database.once('connected', () => {
        console.log('Database Connected');
    })
}

module.exports = connectToMongo;