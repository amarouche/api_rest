import * as Promise from 'bluebird';
var _ = require('lodash');
import connect from '../../common/db_connect';
import L from '../../common/logger';
import { realpathSync } from 'fs';

class PutService {

    transPut(id, trans, name, authorization ){
        return new Promise (function(resolve, reject){
            getAuthoUser(authorization).then(AuthoUser => {
                if(_.isEmpty(AuthoUser))
                    resolve({code: 401})
                else{
                    resolve({code: AuthoUser})
                }
            })
        })
    }
}
function getAuthoUser(autho){
    return new Promise (function(resolve,reject){
        let db = connect.query("SELECT id FROM `user` WHERE password ='"+autho+"'", function (err, result) {
            if (err) throw err;
                resolve(result)
          })
    })
}

export default new PutService();