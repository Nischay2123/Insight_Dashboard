import { Router } from "express";
import { tabChartData, tabTableData } from "../controllers/tab.controller.js";

const router = Router()

router.post("/tab_chart_data",tabChartData);
router.post("/tab_table_data/:tab/:date",tabTableData);

export default router;