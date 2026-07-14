const User = require("../models/User");
const bcrypt = require("bcrypt");

const registerUser = async (userData) => {

    const existingUser = await User.findOne({
        email: userData.email
    });

    if (existingUser) {
        return {
            success: false,
            message: "User already exists"
        };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashedPassword;

    const user = await User.create(userData);

    return {
        success: true,
        message: "User Registered Successfully",
        user
    };
};

module.exports = {
    registerUser
};