import { Router } from "express";
import { paymentChartData } from "../controllers/payment.controller.js";

const router = Router()

router.post("/payment_chart_data",paymentChartData);
// router.post("/tab_table_data/:tab",tabTableData);

export default router;