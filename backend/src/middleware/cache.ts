import { Request, Response, NextFunction, Express } from 'express';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const setupCache = (app: Express) => {
  // Clear cache on POST, PUT, DELETE
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      cache.flushAll();
    }
    next();
  });
};

export const cacheMiddleware = (duration: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.status(200).json(cachedResponse);
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      cache.set(key, body, duration);
      return originalJson(body);
    };

    next();
  };
};