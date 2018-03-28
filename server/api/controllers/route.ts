import * as express from 'express';
import domainsController from './domainsController'
import PostController from './PostController'
export default express.Router()
    .post('/domains/:name/translations.:type', PostController.transPost)
    // .get('/', domainsController.all)
    .get('/domains.:type', domainsController.all)
    .get('/domains/:name.:type', domainsController.getName)
    .get('/domains/:name/translations.:type', domainsController.getTrans);