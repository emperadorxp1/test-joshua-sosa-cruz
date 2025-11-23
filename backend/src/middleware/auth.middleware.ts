import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];

    try {
        const secret = process.env.JWT_SECRET!;
        const payload = jwt.verify(token, secret) as { id: string };
        req.userId = payload.id;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
