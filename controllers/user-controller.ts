import { Request, Response } from "express";
import Users, { checkPasswords, validatePassword } from "../models/user"
import jwt from 'jsonwebtoken';
import { SECRET } from "../config/environment";
import formatValidationError from "../eroors/validation";

export async function getUser(req: Request, res: Response) {
    try {
        const user = await Users.find(req.body)
        res.send(user)
    } catch (e) {
        res.send({ message: "There was an error" })
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const userId = req.params.userId
        const foundUser = await Users.findById(userId)
        res.send(foundUser)
    } catch (e) {

        res.send({ message: "user not found. Did you provide a valid userId?" })
    }
}

export async function getUserByName(req: Request, res: Response) {
    try {
        const userName = req.params.userName
        const foundUser = await Users.findById(userName)
        res.send(foundUser)
    } catch (e) {

        res.send({ message: "user not found. Did you provide a valid userId?" })
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        if (checkPasswords(req.body.password, req.body.passwordConfirmation)) {
            const user = await Users.create(req.body)
            res.send(user)
        }
        else {
            res.status(400).send({ message: "Password do not match", errors: { password: "Password do not match does not match" } })
        }
    } catch (e) {
        res.status(400).send({ message: "There was a problem creating your user. Check you're providing all required fields.", errors: formatValidationError(e) })
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const userId = req.params.userId
        const deletedUser = await Users.findByIdAndDelete(userId)
        res.send(deletedUser)
    } catch (e) {
        res.send({ message: "There was a problem deleting your user." })
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const userId = req.params.userId
        const update = req.body
        const updatedUser = await Users.findByIdAndUpdate(userId, update, { new: true })
        res.send(updatedUser)
    } catch (e) {
        res.send({ message: "There was a problem updating your user." })
    }
}

export async function login(req: Request, res: Response) {
    try {
        const password = req.body.password

        const user = await Users.findOne({ userName: req.body.userName })

        if (!user) return res.status(401).send({ message: "Login failed" })

        const isValidPw = validatePassword(password, user.password)

        if (isValidPw) {
            const token = jwt.sign(
                { userId: user._id },
                SECRET,
                { expiresIn: '24h' }
            )

            res.send({ message: "Login successful", token })
        } else {
            res.status(401).send({ message: "Login failed" })
        }
        res.send(req.body)
    } catch (e) {

    }
}

export async function getCurrentUser(req: Request, res: Response) {
    try {
        res.status(200).send(res.locals.currentUser)
    } catch (e) {
        res.status(500).send({ message: "there was an error, please try again later." })
    }
}