const jwt = require("jsonwebtoken");

const login = (req, res) => {
    const { email, password } = req.body;

    if (email !== "user@test.com" || password !== "123456") {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const user = {
        id: 1,
        name: "Test User",
        role: "USER"
    };

    const token = jwt.sign(
        user,
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        token,
        user
    });
};

module.exports = { login };