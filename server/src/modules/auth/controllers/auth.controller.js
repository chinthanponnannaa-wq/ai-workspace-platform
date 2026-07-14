const { registerUser } = require("../services/auth.service");

const register = async (req, res) => {

    const result = await registerUser(req.body);

    if (!result.success) {
        return res.status(409).json(result);
    }

    return res.status(201).json(result);
};

module.exports = {
    register
};