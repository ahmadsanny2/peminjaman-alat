import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";
import router from "./routes/api.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection successfully");

        await sequelize.sync();
        console.log("Database synchronized successfully");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

app.use("/api", router)

startServer()
