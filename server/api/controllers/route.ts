import * as express from 'express';
import domainsController from './domainsController'
export default express.Router()
    //.post('/domains.:type', controller.create)
    // .get('/', domainsController.all)
    .get('/domains.:type', domainsController.all)
    .get('/domains/:name.:type', domainsController.getName)
    .get('/domains/:name/translations.:type', domainsController.getTrans);