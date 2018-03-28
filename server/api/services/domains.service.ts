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

  getName(name): Promise<any>{
    return new Promise(function(resolve,reject){
      
      let mailerRequest = "SELECT domain.id, slug, name,description, GROUP_CONCAT(domain_lang.lang_id) as langs, GROUP_CONCAT(domain_lang.domain_id) as domain_langs, user.id as user_id,user.username, created_at FROM domain INNER JOIN domain_lang INNER JOIN user ON domain.user_id = user.id  WHERE name = '"+ name+"'  GROUP BY domain.id;";

      let db = connect.query(mailerRequest, function (err, result) {
        if (err) throw err;
        if(resultName(result).length > 0)
        {
          resolve({ code: 404, message: 'error' })
        }
        else{
        resolve({ code: 200, message: 'success', datas: resultName(result) })}
      });
    })
  }

  getTrans(name):Promise<any>{
    return new Promise<Success>(function(resolve,reject){
      let Request = "SELECT id, code, (SELECT GROUP_CONCAT(CONCAT(lang_id, '.', trans)) FROM translation_to_lang WHERE translation_id = translation.id ) as trans FROM translation WHERE domain_id = (SELECT id FROM domain WHERE name = '"+name+"');"
      let db = connect.query(Request, function (err, result) {
        // console.log(result)
        if (err) throw err;
        disp().then(r => {
          let lansgDom=[];
          let domain=[];
          if (r) {
            r.forEach(element => {
              lansgDom.push(element["lang_id"])
            });
              getDomainName().then(t=>{
                t.forEach(ele => {
                  domain.push(ele["name"])
                });
                if(domain.indexOf(name) === -1){
                  resolve({ code: 404, message: 'error', datas: [] })
                }
                else
                  resolve({ code: 200, message: 'success', datas: resultTrans(result,lansgDom) })
              })
          }
        })
      });
    })
  }
  // byId(id: number): Promise<Success> {
  //   L.info(`fetch example with id ${id}`);
  //   return this.all().then(r => r[id])
  // }
}

function resultTrans(result:Array<any>,lansgDom:Array<any>):string[]{
  let LangDomains;
  let allResult = [];
  // console.log(result)
  
  result.forEach(element => {
    var obj={};
    let LangTrans = element['trans'].split(",")
    let t =[]
    LangTrans.forEach(e=>{
      let one = e.split(".");
      let mykey = one[0]
      lansgDom.forEach(langs => {
        if(langs === mykey)
        {
          obj[mykey] = one[1] 
        }
        if(Object.keys(obj).indexOf(langs) === -1){
        obj[langs] = element['code']}
      });
    })
    
    // console.log((obj))
    let r = { 
      "trans":  obj,
      "id":  element['id'],
      "code": element['code'],
  };
    allResult.push(r)
    
  });
  // console.log(allResult)
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
    return ["vide"];
  }
  return allResult[0];
}

function disp():Promise<any>{ 
  {
    return new Promise<Success>(function(resolve,reject){
      let LangDomains
      let db = connect.query("SELECT domain_id, lang_id FROM `domain_lang`", function (err, result) {
        if (err) throw err;
        LangDomains = result
        resolve(LangDomains)
      })
    })
  }
}

function getDomainName():Promise<any>{ 
  {
    return new Promise<Success>(function(resolve,reject){
      let Domains
      let db = connect.query("SELECT name, id FROM `domain`", function (err, result) {
        if (err) throw err;
        Domains = result
        resolve(Domains)
      })
    })
  }
}
export default new DomainsService();