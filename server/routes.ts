import { Application } from 'express';
// import examplesRouter from './api/controllers/examples/router'
import Router from './api/controllers/route'
import { request } from 'https';
export default function routes(app: Application): void {
  app.use('/api/', Router);
  app.use(function(req, res, next) {
    res.status(404).json({ code: 404, message: 'error' , datas:[] });
  })
};