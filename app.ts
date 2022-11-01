
import { createServer } from './util/server';
import { connectDB } from './db/connect';
import { MyToken } from './types/MyToken';
import dotenv from 'dotenv'
dotenv.config();

const app = createServer()

//start application

const port = process.env.PORT || 5000
app.listen(port, async () => {


await connectDB(process.env.MONGO_URI|| '')

  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});


//Express.Request object modifications

declare global {
  namespace Express {
      interface Request {
          tokenUser?: MyToken;
      }
  }
}
