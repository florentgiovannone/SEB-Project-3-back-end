import mongoose, { Schema } from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"

interface IWines {
    winery: string,
    wineName: string,
    region: string,
    country: string,
    style: string,
    vintage: number,
    grapes: string,
    image: string,
    user: mongoose.Schema.Types.ObjectId
}

const wineSchema: Schema<IWines> = new mongoose.Schema<IWines>({
    winery: { type: String, required: true },
    wineName: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, required: true },
    style: { type: String, required: true },
    vintage: { type: Number, required: true },
    grapes: { type: String, required: true },
    image: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

wineSchema.plugin(uniqueValidator)

export default mongoose.model<IWines>('Wine', wineSchema)