import jwt from "jsonwebtoken";

const genToken = (id) => {
    const payload = { user: { id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "10m",
    });

    return token;
};

export default genToken;