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

  getName(name): Promise<Success>{
    return new Promise<Success>(function(resolve,reject){
      
      let mailerRequest = "SELECT domain.id,slug, name,description, GROUP_CONCAT(domain_lang.lang_id) as langs, GROUP_CONCAT(domain_lang.domain_id) as domain_langs, user.id as user_id,user.username, created_at FROM domain INNER JOIN domain_lang INNER JOIN user ON domain.user_id = user.id  WHERE name = '"+ name+"'  GROUP BY domain.id;";

      let db = connect.query(mailerRequest, function (err, result) {
        if (err) throw err;
        L.info(result, 'Result all examples');
        resolve({ code: 200, message: 'success', datas: resultName(result) })
      });
    })
  }
  getTrans():Promise<Success>{
    return new Promise<Success>(function(resolve,reject){
      
      let Request = "SELECT id, code, (SELECT GROUP_CONCAT(CONCAT(lang_id, '.', trans)) FROM translation_to_lang WHERE translation_id = translation.id ) as trans FROM translation WHERE 1;"
      let db = connect.query(Request, function (err, result) {
        if (err) throw err;
        
        resolve({ code: 200, message: 'success', datas: resultTrans(result) })
      });
    })
  }
  // byId(id: number): Promise<Success> {
  //   L.info(`fetch example with id ${id}`);
  //   return this.all().then(r => r[id])
  // }
}

function resultTrans(result:Array<any>):string[]{
  // L.info(result, 'Result all examples');
  let allResult = [];
  result.forEach(element => {
    let LangTrans = element['trans'].split(",")
    var obj = Array;
    LangTrans.forEach(e=>{
      let one = e.split(".");
      
      obj[one[0]]= one[1]
      // langs.push()
      // console.log(langs , "===")
    })
    console.log(obj)
    let r = { 
      "langs":  obj,
      "id":  element['id'],
      "code": element['code'],
  };
    allResult.push(r)
  });
  return allResult;
}

function resultName(result:Array<any>):string[]{
  let allResult = [];
  result.forEach(element => {
    let arrayLang = []
    let creator = {
      "id": element['user_id'],
      "username": element['username']
    }
    let domainLang = element['domain_langs'].split(",")
    for(let k in domainLang){
      if(domainLang[k] == element['id'])
      {
        arrayLang.push(element['langs'].split(",")[k])
      }
    } 
    let r = { 
      "langs":  arrayLang,
      "id":  element['id'],
      "slug": element['slug'],
      "name": element['name'],
      "description": element['description'],
      "creator": creator,
      "created_at": element['created_at'], 
  };
    allResult.push(r)
  });
  if(allResult[0] == null)
  {
    return [];
  }
  return allResult[0];
}
export default new DomainsService();