import * as express from 'express';
import domainsController from './domainsController'
import PostController from './PostController'
import PutController from './PutController'
import DeleteController from './DeleteController'
export default express.Router()
    .post('/domains/:name/translations.:type', PostController.transPost)
    .put('/domains/:name/translations/:id.:type', PutController.transPut)
    .delete('/domains/:name/translations/:id.:type', DeleteController.transDelete)
    // .get('/', domainsController.all)
    .get('/domains.:type', domainsController.all)
    .get('/domains/:name.:type', domainsController.getName)
    .get('/domains/:name/translations.:type', domainsController.getTrans);