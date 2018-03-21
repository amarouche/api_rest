var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"etna_crowding"
});

con.connect(function(err) {             
    if(err) {                                    
      console.log('error when connecting to db:', err);
    }                                  
  }); 

export default con;