import { NextFunction, Request, Response } from "express";
import { SECRET } from "../config/environment";
import Jwt from "jsonwebtoken";
import Users from "../models/user";

export default function secureRoute(req: Request, res: Response, next: NextFunction) {

    const rawToken = req.headers.authorization

    if (!rawToken)
        return res.status(401).json({ message: 'access denied' })

    const token = rawToken?.replace('Bearer ', '')
    Jwt.verify(token, SECRET, async (err, payload) => {
        if (err || !payload) {
            return res.status(401).json({ message: 'access denied' })
        }

        interface jwtPayload {
            userId: string
        }

        const jwtPayload = payload as jwtPayload
        const userId = jwtPayload.userId

        const user = await Users.findById(userId)

        if (!user) return res.status(401).json({ message: 'access denied' })

        res.locals.currentUser = user

        next()
    })
}