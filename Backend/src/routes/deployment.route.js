import { Router } from "express";
import {getDeployemtsData} from "../controllers/deployment.controller.js"

const router = Router()

router.get("/item_deployement_data",getDeployemtsData);

export default router;