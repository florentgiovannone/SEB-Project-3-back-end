import express from 'express'
import mongoose from 'mongoose'
import router from '../../views/router.js' // Import path is now fixed.
import cors from 'cors' // Added this new import
import serverless from "serverless-http"  // added this new import
import dotenv from 'dotenv' // import dotenv
dotenv.config() // call this function on dotenv to get local env variables.

const app = express()

app.use(express.json())
app.use(cors()) // cors middleware added AFTER express.json, BEFORE router.
app.use(router)

async function start() {
    const mongoUrl = process.env.MONGO_DB_URL as string // grab the variable from .env file
    await mongoose.connect(mongoUrl) // use the new variable when connecting to Mongo DB.
}
start()
export const handler = serverless(app) // export this new va