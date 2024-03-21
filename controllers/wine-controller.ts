import { Request, Response } from "express";
import Wines from "../models/wine"


export async function getWines(req: Request, res: Response) {
    try {
        const wines = await Wines.find();
        res.send(wines)
    } catch (e) {
        res.send({ message: "There was a problem getting the Wines." })
    }
}

export async function getwineById(req: Request, res: Response) {
    try {
        const wineId = req.params.wineId
        const foundWine = await Wines.findById(wineId).populate("user")
        res.send(foundWine)
    } catch (e) {

        res.send({ message: "wine not found. Did you provide a valid wineId?" })
    }
}

export async function createwine(req: Request, res: Response) {
    try {
        req.body.user = res.locals.currentUser._id
        const wine = await Wines.create(req.body)
        res.send(wine)
    } catch (e) {
        res.send({ message: "There was a problem creating your wine. Check you're providing all required fields." })
    }
}

export async function deletewine(req: Request, res: Response) {
    try {
        const wineId = req.params.wineId
        const wineToDelete = await Wines.findById(wineId)
        if (!wineToDelete) {
            res.send({ message: "Wine not found" })
        }
        console.log(res.locals.currentUser.userName)
        console.log(wineToDelete)
        console.log(wineToDelete?.user)
        if (res.locals.currentUser._id.equals(wineToDelete?.user)) {
            const deletedWine = await Wines.findByIdAndDelete(wineId)
            return res.send(deletedWine)
        }
        else {
            res.send({ message: "you are not authorised to delete this wine" })
        }
    } catch (e) {
        res.send({ message: "There was a problem deleting your wine." })
    }
}

export async function updatewine(req: Request, res: Response) {
    try {
        const wineId = req.params.wineId
        const wineToUpdate = await Wines.findById(wineId)
        if (!wineToUpdate) {
            res.send({ message: "Wine not found" })
        }

        const update = req.body
        const updatedWine = await Wines.findByIdAndUpdate(wineId, update, { new: true })
        if (res.locals.currentUser._id.equals(wineToUpdate?.user)) {
            return res.send(updatedWine)
        }
        else {
            res.send({ message: "you are not authorised to update this wine" })
        }

    } catch (e) {
        res.send({ message: "There was a problem updating your wine." })
    }
}