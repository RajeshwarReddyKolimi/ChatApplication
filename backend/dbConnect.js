const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to database");
    } catch (error) {
        console.error(error);
    }
};
module.exports = dbConnect;
