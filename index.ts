import express from 'express'
import mongoose from 'mongoose'
import router from './views/router'
import ExpressMongoSanitize from 'express-mongo-sanitize'

const app = express()

app.use(express.json())
app.use(ExpressMongoSanitize())
app.use(router)

async function start() {
    await mongoose.connect('mongodb://127.0.0.1:27017/rouge-winedb')
    console.log('Connected to the database');

    app.listen(3000, () => {
        console.log("express API is running on  http://localhost:3000");
        
    })
    
}

start()