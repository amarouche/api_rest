import * as Promise from 'bluebird';
import connect from '../../common/db_connect';
import L from '../../common/logger';
var _ = require('lodash');
import { realpathSync } from 'fs';



class DeleteService {

    transDelete(id, domain, authorization ){
        return new Promise (function(resolve, reject){
            getAuthoUser(authorization).then(AuthoUser => {
                if(_.isEmpty(AuthoUser))
                    resolve({code: 401})
                else{
                    getDomainByUser(domain,AuthoUser).then(na =>{
                        if(_.isEmpty(na))
                            resolve({code: 403})
                        else
                        getIdByDomainId(id,domain).then(IdByDomainId=>{
                            if(_.isEmpty(IdByDomainId))
                            {
                                resolve({code: 400, message: "error", datas:"id no found"})
                            }
                            else
                                DeleteTrans(id).then(delTrans =>{
                                    resolve(delTrans)
                                })
                        })
                    })
                }
            })

        })
    }

}

function DeleteTrans(id){
    return new Promise (function(resolve,reject){
        // let db = connect.query("DELETE  FROM `translation` WHERE id ='"+id+"'", function (err, result) {
        //     if (err) throw err;
        // })
        let dbs = connect.query("DELETE FROM `translation_to_lang` WHERE translation_id ='"+id+"'", function (err, result) {
            if (err) throw err;
            let db = connect.query("DELETE  FROM `translation` WHERE id ='"+id+"'", function (err, result) {
                if (err) throw err;
            })
        })
        resolve({code: 200,
        message: "success",
        datas: {
            id: id
        }})
    })
}

function getIdByDomainId(id, domain){
    return new Promise (function(resolve,reject){
        getDomain(domain).then(gDomain=>{
            console.log(gDomain)
            let db = connect.query("SELECT id FROM `translation` WHERE id ='"+id+"' AND domain_id ='"+gDomain[0].id+"'", function (err, result) {
                if (err) throw err;
                    resolve(result)
            })
            // resolve(gDomain)
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

function getDomain(domain)
{
    return new Promise (function(resolve,reject){
        let db = connect.query("SELECT user_id, name, id FROM `domain` WHERE name ='"+domain+"'", function (err, result) {
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

export default new DeleteService();
