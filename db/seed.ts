import mongoose from 'mongoose'
import User from '../models/user'
import Wine from "../models/wine"

const userData = [
    { userName: "Winemaster", firstName: "Dinul", lastName: "Haque", email: "princ3mo3@gmail.com", password: "Winei$life1" },
    { userName: "wineLover", firstName: "Florent", lastName: "Giovannone", email: "f.giovannone@me.com", password: "Winei$life2" }
]

const WineData = [
    { winery: "Fattoria dei Barbi", wineName: "Brunello di Montalcino", region: "Montalcino", country: "Italy", style: "Red", grapes: "Sangiovese", vintage: 2016, image: "https://cdn.vinissimus.com/img/unsafe/p500x/plain/local:///prfmtgrande/vi/brufb19_anv800.png" },
    { winery: "Pax Mahle Wines", wineName: "Sonoma-Hillsides", region: "Sonoma", country: "United-states", style: "Red", grapes: "Syrah", vintage: 2016, image: "https://thesourcingtable.com/cdn/shop/products/pax_sonoma_hillside_4d586314-c48a-488e-bd02-949d1ae7bb38_2000x.png?v=1703157406" }
]

async function seed() {
    await mongoose.connect('mongodb://127.0.0.1:27017/rouge-winedb')
    console.log("Connected to the Rouge-Wine Datatbase");

    await mongoose.connection.db.dropDatabase()
    console.log("Remove existing data");

    const user = await User.create(userData)

    WineData.forEach((wine: any) => wine.user = user[0])

    const wines = await Wine.create(WineData)

    console.log("Here are the wines!");

    await mongoose.disconnect()
    console.log("disconnected");
    
}
seed()