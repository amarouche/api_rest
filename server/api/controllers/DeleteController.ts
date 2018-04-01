import DeleteService from '../services/Delete.service';
import { Request, Response } from 'express';

export class PostController {

    transDelete(req: Request, res: Response): void {
        DeleteService.transDelete(req.params.id, req.params.name, req.headers.authorization).then((r:any) => {
            if (r) {
                if(r.code === 401)
                res.status(401).json({ code: 401, message: 'error authorization'});
                else if(r.code === 403)
                    res.status(403).json({ code: 403, message: 'error domain'});
                else if(r.code === 400)
                    res.status(400).json(r);
                else if(req.params.type !== 'json')
                    res.status(400).json({ code: 400, message: 'error', datas:[] })
                else
                    res.status(201).json(r)
            }
        })

    }

}
export default new PostController();