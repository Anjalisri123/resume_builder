import express from 'express';
import cors from 'cors';
import "dotenv/config";
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import userRouter from './routes/Userroutes.js';
import resumeRouter from './routes/resumeroutes.js';
import aiRouter from './routes/aiRoutes.js';



const app = express();
const PORT = process.env.PORT || 5000;
//database connection
await connectDB()  
app.use(express.json());



app.use(cors());

app.get('/', (req, res) => {res.send('server is live.......');});
app.use('/api/users',userRouter)
app.use('/api/resumes',resumeRouter)
app.use('/api/ai',aiRouter)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);


});