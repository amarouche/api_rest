import * as Promise from 'bluebird';
var _ = require('lodash');
import connect from '../../common/db_connect';
import L from '../../common/logger';
import { realpathSync } from 'fs';

class PostService {

    transPost(code,trans:object, name, authorization ){
        return new Promise (function(resolve, reject){
            let form:{}
            getAuthoUser(authorization).then(AuthoUser => {
                if(_.isEmpty(AuthoUser))
                    resolve({code: 401})
                else{
                    getDomain(name).then(Domain => {
                        if(_.isEmpty(Domain))
                            resolve({code: 403})
                        else
                            getDomainByUser(name,AuthoUser).then(na =>{
                                if(_.isEmpty(na))
                                    resolve({code: 403})
                                else
                                    // console.log(emptyElem(trans))
                                    if(code === '' || emptyElem(trans) === 1)
                                        resolve({ code: 400, message: 'error', datas: "code or trans is empty"})
                                    else
                                    getDomainLang(trans).then(DomainLang => {
                                        // console.log(DomainLang)
                                        if(DomainLang[0])
                                        { 
                                            let lang ={ "lang": " lang no found "+DomainLang }
                                            form = {"form": lang }
                                            resolve({ code: 400, message: 'error', datas: form})
                                        }
                                            else 
                                            getCode(code).then(c =>{
                                                if(!_.isEmpty(c)){
                                                    let lang = { "code":  code + " alredy exist"}
                                                    form = {"form": lang }
                                                    resolve({ code: 400, message: 'error' + code, datas:form})
                                                    }
                                                else
                                                    getDomLangs(Domain[0].id).then(DomLangs =>{
                                                        insertTrans(code, Domain[0].id).then(insertT =>{
                                                            insertTransLang(code, trans, DomLangs, insertT).then(transLang =>{
                                                                resolve({ code: 201, message: 'success', datas: transLang })
                                                            })
                                                        })
                                                    })
                                            })
                                    })
                            })
                        })    
                }
            })    
        })
    }

}


function insertTrans(code, domainId){
    return new Promise (function(resolve,reject){
        let db = connect.query("INSERT INTO `translation` (domain_id, code) VALUES ('"+domainId+"','"+code+"')", function (err, result) {
            if (err) throw err;
                resolve(result.insertId)
        })
    })
}
function insertTransLang(code, trans, langsDomain, insertIdTrans){
    return new Promise (function(resolve,reject){
            let obj:{}
            let t :{}
            
            // console.log(responsPost(code, trans, langsDomain, insertIdTrans))
            langsDomain.forEach(el => {
                if(Object.keys(trans).indexOf(el) === -1){
                    trans[el] = code
                }
            });
            let lang = Object.keys(trans)
            let trad = (<any>Object).values(trans)

            for(let k in lang) {
                let db = connect.query("INSERT INTO `translation_to_lang` (`translation_id`, `lang_id`,`trans`) VALUES ('"+insertIdTrans+"','"+lang[k]+"','"+trad[k]+"' ) ", function (err, result) {
                    if (err) throw err;
                  })
            };
            
            resolve(responsPost(code, lang, trad, insertIdTrans))
    })
}

function responsPost(code, lang, trad, insertIdTrans)
{
    let tabTrans = {}
    for(let k in lang) {
        tabTrans[lang[k]] = trad[k]
    }
    let data = {
        "trans": tabTrans,
        "code" :code,
        "id":insertIdTrans, 
    }
    return data
// console.log(data)
}


function getDomainByUser(domain, autho_id)
{
    return new Promise (function(resolve,reject){
        let db = connect.query("SELECT * FROM `domain` WHERE user_id ='"+autho_id[0].id+"' AND name = '"+domain+"'", function (err, result) {
            if (err) throw err;
                resolve(result)
          })
    })
}

function getCode(code){
    return new Promise (function(resolve,reject){
        let db = connect.query("SELECT  code FROM `translation` WHERE code ='"+code+"'", function (err, result) {
            if (err) throw err;
                // if(result[0].code != "undefined")
                //     resolve(false)
                // else
                    resolve(result)                
                
          })
    })
}

function getDomainLang(trans)// recupere les langs du domain et compare avec l'obj trans 
{
    return new Promise (function(resolve,reject){
        let tab =(<any>Object).keys(trans)
        let resultLang = []
        let r = tab.join("','"); 
        let db = connect.query("SELECT lang_id FROM `domain_lang` WHERE lang_id IN ('"+r+"')", function (err, result) {
            if (err) throw err;
                result.forEach(element => {
                    resultLang.push(element.lang_id)
                });
            resolve(arr_diff(resultLang,tab))
          })
    })
}

function getAuthoUser(autho){
    return new Promise (function(resolve,reject){
        let db = connect.query("SELECT id FROM `user` WHERE password ='"+autho+"'", function (err, result) {
            if (err) throw err;
                resolve(result)
          })
    })
}

function getDomain(name)
{
    return new Promise (function(resolve,reject){
        let db = connect.query("SELECT user_id, name, id FROM `domain` WHERE name ='"+name+"'", function (err, result) {
            if (err) throw err;
                resolve(result)
          })
    })
}

function getDomLangs(domainId)
{
    return new Promise (function(resolve,reject){
        let langs=[]
        let db = connect.query("SELECT lang_id FROM `domain_lang` WHERE domain_id ='"+domainId+"'", function (err, result) {
            if (err) throw err;
            result.forEach(element => {
                
                langs.push(element.lang_id)
            });
                resolve(langs)
          })
    })
}




function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

function emptyElem(trans) {
    let val:number = 0;
    let tab = (<any>Object).values(trans)
    tab.forEach(element => {
        if(element === '')
            val = 1;
    });
    return val
}
// function emptyElem(obj) {
//     for(var key in obj) {
//         if(obj.hasOwnProperty(key))
//             return false;
//     }
//     return true;
// }
export default new PostService();