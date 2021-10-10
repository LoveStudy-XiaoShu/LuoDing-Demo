var mysql      = require('mysql');
//创建链接，创建一个对象
var connection = mysql.createConnection({
    host     :'localhost',
    user     :'root',
    password :'Ldd11.24',
    database  :'ajax_demo'
});
//链接数据酷
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});
//查询操作
connection.query('SELECT*FROM ajaxDemo',function (error,result){
    console.log(result);
})