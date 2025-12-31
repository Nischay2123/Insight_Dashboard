import { Router } from "express";
import { getTopPerformingItemData,getItemData} from "../controllers/item.controller.js";

const router = Router()

router.post("/item_menu/:deploymentId",getItemData);
router.post("/Top20_item_menu/:deploymentId",getTopPerformingItemData);
export default router;