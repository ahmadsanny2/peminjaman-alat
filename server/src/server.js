import express from 'express'
import router from './routes/api.js'
import cors from 'cors'

const app = express()
const host = 'localhost'
const port = 3000



app.use(cors({
    origin: '*'
}))

app.use(express.json())

app.use('/', router)

app.listen(port, () => {
    console.log(`Server is running at http://${host}:${port}`)
})