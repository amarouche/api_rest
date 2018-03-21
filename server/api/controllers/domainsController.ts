import DomainsService from '../services/domains.service';
import { Request, Response } from 'express';

interface ERROR {
  code: number,
  message: string,
};
const err: ERROR[] = [
    { code: 404, message: 'error' }
];
const errs: ERROR[] = [
  { code: 400, message: 'error' }
];


export class DomainsController {
  all(req: Request, res: Response): void {
    if(req.params.type === 'json'){
      DomainsService.all().then(r => {
        if (r) res.json(r)
        else res.status(404).json(err);
      });
    }
    else
      res.status(400).json(errs)
  }

  // byId(req: Request, res: Response): void {
  //   DomainsService.byId(req.params.id).then(r => {
  //     if (r) res.json(r);
  //     else res.status(404).end();
  //   });
  // }

}
export default new DomainsController();
