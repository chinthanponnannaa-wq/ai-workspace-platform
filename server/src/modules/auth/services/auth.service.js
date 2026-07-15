const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    user.password = undefined;
    const token = jwt.sign(
    {
        id: user._id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

    return {
        success: true,
        message: "User Registered Successfully",
        token,
        user
    };
};
const loginUser = async (userData) => {

    const user = await User.findOne({
        email: userData.email
    });

    if (!user) {
        return {
            success: false,
            message: "Invalid email or password"
        };
    }

    const isPasswordCorrect = await bcrypt.compare(
        userData.password,
        user.password
    );

    if (!isPasswordCorrect) {
        return {
            success: false,
            message: "Invalid email or password"
        };
    }

    user.password = undefined;

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return {
        success: true,
        message: "Login Successful",
        token,
        user
    };
};

module.exports = {
    registerUser,
    loginUser
};