import { Router } from "express";
import {getCategoryData,getTopPerformingCategoryData} from "../controllers/categories.controller.js"

const router = Router()

router.post("/category_data/:deploymentId",getCategoryData);
router.post("/Top5_category_menu/:deploymentId",getTopPerformingCategoryData);


export default router;