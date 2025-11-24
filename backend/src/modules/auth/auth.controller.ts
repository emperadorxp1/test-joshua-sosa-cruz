import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model";
import { AuthRequest } from "../../middleware/auth.middleware";

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashed
    });

    return res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email
    });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1d"
    });

    return res.json({ token });
};

export const me = async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.userId).select("-password");
    return res.json(user);
};
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 */
