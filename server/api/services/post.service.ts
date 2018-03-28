import * as Promise from 'bluebird';
import connect from '../../common/db_connect';
import L from '../../common/logger';

class PostService {


    transPost(code,trans:object, name, authorization ){
        return new Promise (function(resolve, reject){
            // console.log(authorization, "====")
            getAuthoUser(authorization).then(t=>{
                // console.log(t)
                if(!t[0]){
                    resolve({ code: 401, message: 'error'})
                }
                else
                    resolve({ code: 200, message: 'success', datas: authorization })
            
                
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
export default new PostService();