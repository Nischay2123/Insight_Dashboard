import { Router } from "express";
import {getDeployemntWiseCategoryData, getDeployemntWiseItemData, getDeployemtsData,getDeploymentAnalytics} from "../controllers/deployment.controller.js"

const router = Router()

router.get("/deployment_data",getDeployemtsData);
router.post("/item_deployment_data",getDeployemntWiseItemData);
router.post("/category_deployment_data",getDeployemntWiseCategoryData);
router.post("/deployment_data",getDeploymentAnalytics);

export default router;