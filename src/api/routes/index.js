import { Router } from "express";

import { authenticateWithToken } from "../middlewares/auth.js";
import { handle404, handleError } from "../middlewares/errors.js";
import authRouter from "./auth.js";
import auctionModelRouter from "./auctionmodel.js";
import urls from "../urls.js";

const router = Router();

// Authentication
router.use(authenticateWithToken);
router.use(urls.apiPrefix + urls.auth.path, authRouter);

// CRUD API
router.use(urls.apiPrefix + urls.auctionModel.path, auctionModelRouter);

// Error handlers
router.use(handle404);
router.use(handleError);

export default router;
