import {enhanceProfessionalSummary,enhanceJOBDescription,uploadResume} from "../configs/controllers/aiController.js"
import express from 'express';
import protect from '../middlewares/authmiddleware.js';



const aiRouter= express.Router();
aiRouter.post ('/enhance-pro-sum',protect ,enhanceProfessionalSummary)
aiRouter.post ('/enhance-job-desc',protect ,enhanceJOBDescription)
aiRouter.post ('/upload-resume',protect ,uploadResume)

export default aiRouter;