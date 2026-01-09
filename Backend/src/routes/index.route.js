import { Router } from "express";
import tabRoutes from './tab.routes.js';
import itemRoutes from './item.route.js';
import deploymentRoutes from './deployment.route.js';
import categoryRoutes from './categories.route.js';
import paymentsRoutes from './payments.route.js';

const router = Router()

router.use("/deployment",deploymentRoutes)
router.use("/items",itemRoutes)
router.use("/tabs",tabRoutes)
router.use("/category",categoryRoutes)
router.use("/payments",paymentsRoutes)

export default router;