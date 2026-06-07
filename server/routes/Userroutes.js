import express from "express";
import { loginUser, registerUser ,getUserbyID,getResumes} from "../configs/controllers/userController.js";
import protect from "../middlewares/authmiddleware.js";
const userRouter=express.Router();
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser);
userRouter.get('/data',protect ,getUserbyID);
userRouter.get('/resumes',protect ,getResumes);
export default userRouter