import PostService from '../services/post.service';
import { Request, Response } from 'express';

export class PostController {

    transPost(req: Request, res: Response): void {
        // if(req.params.type === 'json'){
            PostService.transPost(req.body.code, req.body.trans, req.params.name, req.headers.authorization).then((r:any) => {
            if (r) {
                if(r.code === 401)
                    res.status(401).json({ code: 401, message: 'error authorization'});
                else if(r.code === 403)
                    res.status(403).json({ code: 403, message: 'error domain'});
                else if(r.code === 400)
                    res.status(400).json(r);
                else
                    res.status(201).json(r)
              }
            
            });
        }

}
export default new PostController();