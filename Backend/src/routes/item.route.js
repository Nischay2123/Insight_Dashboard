import { Router } from "express";
import { getDeployemtsData,getTopPerformingItemData,getItemData, getTopPerformingCategoryData, getCategoryData } from "../controllers/item.controller.js";

const router = Router()

router.get("/item_deployement_data",getDeployemtsData);
router.post("/category_data/:deploymentId",getCategoryData);
router.post("/item_menu/:deploymentId",getItemData);
router.post("/Top5_category_menu/:deploymentId",getTopPerformingCategoryData);
router.post("/Top20_item_menu/:deploymentId",getTopPerformingItemData);
export default router;