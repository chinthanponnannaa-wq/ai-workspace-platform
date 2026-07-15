const {
    registerUser,
    loginUser
} = require("../services/auth.service");

const register = async (req, res) => {

    const result = await registerUser(req.body);

    if (!result.success) {
        return res.status(409).json(result);
    }

    return res.status(201).json(result);

};

const login = async (req, res) => {

    const result = await loginUser(req.body);

    if (!result.success) {
        return res.status(401).json(result);
    }

    return res.status(200).json(result);

};

const profile = async (req, res) => {

    return res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: req.user
    });

};

module.exports = {
    register,
    login,
    profile
};