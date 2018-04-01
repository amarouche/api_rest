import * as Promise from 'bluebird';
var _ = require('lodash');
import connect from '../../common/db_connect';
import L from '../../common/logger';
import { realpathSync } from 'fs';

class PutService {

    transPut(id, trans, name, authorization ){
        return new Promise (function(resolve, reject){
            let form:{}
            let tab = (<any>Object).values(trans)

            getAuthoUser(authorization).then(AuthoUser => {
                if(_.isEmpty(AuthoUser))
                    resolve({code: 401})
                    else{
                        // getDomain(name).then(Domain => {
                        //     if(_.isEmpty(Domain))
                        //         resolve({code: 403})
                            // else
                                getDomainByUser(name,AuthoUser).then(na =>{
                                    if(_.isEmpty(na))
                                        resolve({code: 403})
                                    else
                                        // console.log(emptyElem(trans))
                                        tab.forEach(element => {
                                                if(element === '')
                                                resolve({ code: 400, message: 'errodr', datas: "trans is empty"})
                                            });
                                        // if(emptyElem(trans) === 1)
                                           
                                        // else{
                                            getDomainLang(trans).then(DomainLang => {
                                                // console.log(DomainLang)
                                                if(DomainLang[0])
                                                { 
                                                    let lang ={ "lang": " lang no found "+DomainLang }
                                                    form = {"form": lang }
                                                    resolve({ code: 400, message: 'error', datas: form})
                                                }
                                                else {
                                                    getIdTransExist(id).then(idTransExist => {
                                                    if(_.isEmpty(idTransExist)){
                                                        let lang ={ "id": "id no found "+id }
                                                        form = {"form": lang }
                                                        resolve({ code: 400, message: 'error', datas: form})
                                                    }
                                                    else
                                                        putLang(id, trans).then(put => {
                                                            
                                                            resolve({ code: 200, message: 'succdess', datas: put})
                                                        })  
                                                    })
                                                }
                
                                            })
                                        // }
                                    })
                            //})
                        }                              
                    })
        })
    }
}

function putLang(id, trans){
    return new Promise (function(resolve,reject){
    let lang = Object.keys(trans)
    let val = (<any>Object).values(trans)
    for(let k in lang) {
        //UPDATE `translation` SET `code` = 'waffdfso' WHERE `translation`.`id` = 145;
        let db = connect.query("UPDATE `translation_to_lang` SET `trans` = '"+val[k]+"' WHERE `translation_to_lang`.`translation_id` = "+id+" AND `translation_to_lang`.`lang_id` = '"+lang[k]+"'", function (err, result) {
            if (err) throw err;
          })
    }
    result(id).then(e=>{
        resolve(e)
    })
    
    })
}
function result(id){
    return new Promise (function(resolve,reject){
        let db = connect.query("SELECT id, code, (SELECT GROUP_CONCAT(CONCAT(lang_id, '.', trans)) FROM translation_to_lang WHERE translation_id = translation.id ) as trans FROM translation WHERE id ='"+id+"'", function (err, result) {
            if (err) throw err;
                var obj={};
                let resu = {}
                let trad = result[0].trans.split(",")
                trad.forEach(e=>{
                    let one = e.split(".");
                    let mykey = one[0]
                    let val = one[1]
                    obj[mykey]=val
                })
                resu = {
                    "trans": obj,
                    "id": result[0].id,
                    "code": result[0].code
                }
                resolve(resu)
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
function getDomainByUser(domain, autho_id)
{
    return new Promise (function(resolve,reject){
        let db = connect.query("SELECT * FROM `domain` WHERE user_id ='"+autho_id[0].id+"' AND name = '"+domain+"'", function (err, result) {
            if (err) throw err;
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

function getIdTransExist(id){
    return new Promise (function(resolve,reject){
        let db = connect.query("SELECT * FROM `translation` WHERE id ='"+id+"'", function (err, result) {
            if (err) throw err;
                resolve(result)
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
    let key = Object.keys(trans)
    for(let k in key)
    {
        if(tab[k] === '')
            val = 1;
    }    
    // tab.forEach(element => {
    //     if(element === '')
    //         val = 1;
    // });
    return val
}

export default new PutService();