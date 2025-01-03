// this file sets up the main router and includes the API routes under the /api endpoint and the HTML routes under the root endpoint.
import { Router } from 'express';
const router = Router();
import apiRoutes from './api/index.js';
import htmlRoutes from './htmlRoutes.js';
router.use('/api', apiRoutes);
router.use('/', htmlRoutes);
export default router;
