import * as Promise from 'bluebird';
import connect from '../../common/db_connect';
import L from '../../common/logger';

let id = 0;
interface Success {
  code: number,
  message: string,
  datas: any,
};
let domain
// const examples: Success[] = [
//     { code: 200, message: 'success', data:[] }
// ];

 class DomainsService {
   all(): Promise<Success> {
    return new Promise<Success> (function(resolve, reject){
      let db = connect.query("select id, slug, name, description from domain;", function (err, result) {
        if (err) throw err;
        resolve({ code: 200, message: 'success', datas: result })
      });
    })
  }

  // byId(id: number): Promise<Success> {
  //   L.info(`fetch example with id ${id}`);
  //   return this.all().then(r => r[id])
  // }
}
export default new DomainsService();