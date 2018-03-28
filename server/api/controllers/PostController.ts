import PostService from '../services/post.service';
import { Request, Response } from 'express';

export class PostController {

    transPost(req: Request, res: Response): void {
        // if(req.params.type === 'json'){
            PostService.transPost(req.body.code, req.body.trans, req.params.name, req.headers.authorization).then((r:any) => {
              if (r) {
                //   if(r[code] ===)
                console.log(r.code)
                  res.json(r)

              }
              else res.status(404).json({ code: 404, message: 'error'});
            });
        }

}
export default new PostController();