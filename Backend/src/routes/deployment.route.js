import { Router } from "express";
import {getDeployemntWiseItemData, getDeployemtsData,getDeploymentAnalytics} from "../controllers/deployment.controller.js"

const router = Router()

router.get("/deployment_data",getDeployemtsData);
router.post("/item_deployment_data",getDeployemntWiseItemData);
router.post("/deployment_data",getDeploymentAnalytics);

export default router;