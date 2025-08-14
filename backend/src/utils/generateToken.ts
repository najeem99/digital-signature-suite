import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (id: string, role: string, name: string, email: string
) => {
    const payload = { id, role, name, email };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
};
