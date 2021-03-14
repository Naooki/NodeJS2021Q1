import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200);
  res.json({
    status: 'OK',
    environment: process.env.APP_ENV,
    app_version: process.env.npm_package_version,
  });
});

export { router as statusRoutes };
