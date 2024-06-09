import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PORT } from "./secrets";
import rootRouter from "@/routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";


dotenv.config({ path: ".env" });

const app: Express = express();

console.log(PORT);

app.use(express.json())

app.use('/api', rootRouter)

export const prismaClient = new PrismaClient({
    log:['query']
})

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
