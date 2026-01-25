import jwt from "jsonwebtoken";

const verifyToken = (token) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return false;
        } else {
            return user.id;
        }
    });
};

export default verifyToken;