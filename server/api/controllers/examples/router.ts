import * as express from 'express';
import controller from './controller'
export default express.Router()
    //.post('/domains.:type', controller.create)
    .get('/', controller.all)
    // .get('/domain', controller.allDomain)
    .get('?:id', controller.byId);