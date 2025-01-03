// this file sets up the router for the /weather endpoint.

import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';

router.use('/weather', weatherRoutes);

export default router;
