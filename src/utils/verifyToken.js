import jwt from "jsonwebtoken";

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.user.id;
    } catch (error) {
        return null;
    }
};

export default verifyToken;