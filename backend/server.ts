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
}).$extends({
  result:{
    address:{
      formattedAddress:{
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true
        },
        compute: (addr) => {
          return  `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
        }
      }
    }
  }
})

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
