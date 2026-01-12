import { Router } from "express";
import {createDeploymentGroup, getDeployemntWiseCategoryData, getDeployemntWiseItemData, getDeployemtsData,getDeploymentAnalytics, getDeploymentGroup} from "../controllers/deployment.controller.js"

const router = Router()

router.get("/deployment_data",getDeployemtsData);
router.post("/item_deployment_data",getDeployemntWiseItemData);
router.post("/category_deployment_data",getDeployemntWiseCategoryData);
router.post("/deployment_data",getDeploymentAnalytics);
router.post("/create_deployment_group",createDeploymentGroup);
router.get("/get_deployment_group",getDeploymentGroup);

export default router;