import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: './env/production.env' });
} else if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: './env/test.env' });
} else {
    dotenv.config({ path: './env/development.env' });
}

const PORT = process.env.PORT
const DB_URI = process.env.DB_URI_DEV
const JWT_SECRET = process.env.JWT_SECRET


const app = express()
app.use(express.json())
app.use(cors())

app.get('/helloworld',(req,res)=>{
    res.send("<h1>Hello World</h1>")
})

app.listen(PORT , ()=>{
    console.log("Server started at http://localhost:" + PORT)
})