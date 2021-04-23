var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'rabbaniidb.crtsakrtwsnv.us-west-2.rds.amazonaws.com',
  user            : 'rabbaniidb',
  password        : 'FV9nBp9YxjUMviZB',
  database        : 'rabbaniidb'
});
module.exports.pool = pool;
