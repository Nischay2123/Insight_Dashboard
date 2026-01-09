import { Router } from "express";
import { paymentChartData,paymentTableData } from "../controllers/payment.controller.js";

const router = Router()

router.post("/payment_chart_data",paymentChartData);
router.post("/payment_table_data/:paymentMode/:date",paymentTableData);

export default router;