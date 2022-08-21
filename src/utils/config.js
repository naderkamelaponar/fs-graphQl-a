/** بسم الله الرحمن الرحيم */
require("dotenv").config();

const MONGO_URI = process.env.MONGODB_URI
const jwtSecret = process.env.JWT_SECRET;
const hashSalt =  process.env.HASH_SALT
module.exports = {
		MONGO_URI,
		jwtSecret,
		hashSalt
};
