import DomainsService from '../services/domains.service';
import { Request, Response } from 'express';

interface ERROR {
  code: number,
  message: string,
};

export class DomainsController {
  all(req: Request, res: Response): void {
    if(req.params.type === 'json'){
      DomainsService.all().then(r => {
        if (r) res.json(r)
        else res.status(404).json({ code: 404, message: 'error'});
      });
    }
    else
      res.status(400).json({ code: 400, message: 'error', datas:[] })
  }

  getName(req: Request, res: Response): void {
    if(req.params.type === 'json'){
      let authorization = null
      if(req.headers.authorization)
      {
        authorization = req.headers.authorization
      }
        DomainsService.getName(req.params.name, authorization).then(r => {
          if (r && r.code !== 404) {
              res.json(r)
          }
          else res.status(404).json({ code: 404, message: 'error'});
        });
    }
    else
      res.status(400).json({ code: 400, message: 'error', datas:[] })
  }

  getTrans(req: Request, res: Response): void {
    if(req.params.type === 'json'){
      let code = null
      if(req.query.code)
      {
        code = req.query.code
      }
      DomainsService.getTrans(req.params.name, code).then(r => {
        if (r && r.code !== 404) {
          res.json(r)
        }
        else
        res.status(404).json({ code: 404, message: 'error'});
      });
    }
    else
      res.status(400).json({ code: 400, message: 'error', datas:[] })
  }
  // byId(req: Request, res: Response): void {
  //   DomainsService.byId(req.params.id).then(r => {
  //     if (r) res.json(r);
  //     else res.status(404).end();
  //   });
  // }

}
export default new DomainsController();
