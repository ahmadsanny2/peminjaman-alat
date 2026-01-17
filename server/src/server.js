import express from 'express'
import router from './routes/api.js'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

dotenv.config()

const app = express()
const host = 'localhost'
const port = process.env.PORT || 5000

app.use(express.json())

app.use(cors({
    origin: '*'
}))

connectDB()

app.use('/api', router)

app.listen(port, () => {
    console.log(`Server is running at http://${host}:${port}`)
})