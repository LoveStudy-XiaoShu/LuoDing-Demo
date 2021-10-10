var http=require('http');
var fs=require('fs');
var url=require('url');
var querystring=require('querystring');
var mysql=require('mysql');
var cookie=require('cookie');
//-------------------------------
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


var app=http.createServer(function (req,res){
    var url_value=url.parse(req.url);
    //首页部分逻辑
    console.log(url_value.pathname)
    if(url_value.pathname==='/'){
        render('index.html',res);
        return;
    }
    //处理注册功能逻辑部分
    if(url_value.pathname==='/usename'&&req.method==='POST'){
        res.setHeader('content-type','text/html;charset=utf-8');
        var obj_info='';
        req.on('data',function (chunk){
            obj_info += chunk;
        })
        req.on('end',function (err){
            var obj_use=querystring.parse(obj_info);
            if(!err){
                var obj_use=querystring.parse(obj_info);
                if(obj_use.name===''||obj_use.password==='') {
                    res.write('{"status":1,"message":"输入的为空请重新输入"}','utf-8');
                    res.end();
                    return;
                }
                if (obj_use.password !== obj_use.repassword){
                    res.write('{"status":1,"message":"输入的密码错误请重新输入"}','utf-8');
                    res.end();
                    return;
                }
                var ajs_con='INSERT INTO ajaxDemo(name,pssword)VALUE("'+obj_use.name+'","'+obj_use.password+'")';
                connection.query(ajs_con,function (error,result,){
                    //如果没有错误，并且result长度不为0，返回注册成功
                    console.log("error:"+error);
                    console.log("result:"+result.length);
                    console.log("!error:"+!error);
                    if(!error&&result&&result.length!==0){
                        res.write('{"status":0,"message":"注册成功"}','utf-8');
                        res.end();
                        console.log('{"status":0,"message":"注册成功"}','utf-8');
                        return;

                    }
                })

            }
        })
        return;
    }
    //处理登陆逻辑部分
    if(url_value.pathname==='/login'&&req.method==='POST'){
        res.setHeader('content-type','text/html;charset=utf-8');
        var obj_value='';
        req.on('data',function (chunk){
            obj_value+=chunk;
        })
        req.on('end',function (err){
            if(!err){
                var obj=querystring.parse(obj_value);
                console.log(obj.username+"----"+obj.password);

                var sql_select='SELECT*FROM ajaxDemo WHERE name="'+obj.username+'" AND pssword="'+obj.password+'"';
                connection.query(sql_select,function (err,result){
                    if(!err&&result&&result.length!==0){
                        res.setHeader('Set-Cookie',cookie.serialize('login_in',true));
                        console.log(result);
                        res.write('{"status":0,"message":"成功登陆"}','utf-8');
                    }else{
                        res.write('{"status":1,"message":"账号密码错误"}','utf-8');
                    }
                    res.end();
                })
            }
        })
        return;

    }
    //返回表格数据逻辑部分
    if(url_value.pathname==='/list'&&req.method==='GET') {
        res.setHeader('content-type','text/html;charset=utf-8');
        //链接数据库，把所有的数据都链接起来
        var sql="SELECT * FROM user";
        connection.query(sql,function (err,result){
            //result是一个数字，装换成字符串
            if(!err&&result){
                //把数组转换成英文
                var sql_string=JSON.stringify(result);
                res.write('{"status":0,"message":'+sql_string+'}','utf-8');
                res.end();
                console.log(111);
            }

        })
        return;
    }
    //数据保存部分
    if(url_value.pathname==='/username'&&req.method==='POST'){
        var obj_info='';
        req.on('data',function(chunk){
            obj_info+=chunk;
        })
        req.on('end',function (err){
            if(!err){
                var obj=querystring.parse(obj_info);
                var sql='INSERT INTO user VALUES ('+null+',"'+obj.username+'","'+obj.email+'","'+obj.phone+'","'+obj.qq+'")'
                connection.query(sql,function(err,data){
                    if(!err&&data){
                        res.write('{"status":0,"message":12}','utf-8');
                        res.end();
                        console.log('succes');
                    }
                })
                console.log(obj);
            }
        })
        return;

    }
    //数据修改部分
    if(url_value.pathname==='/save_x'&&req.method==='POST'){
        res.setHeader('content-type','text/html;charset=utf-8');
        var obj_s='';
        req.on('data',function (chunk){
            obj_s+=chunk;
        })
        req.on('end',function (err){
            if(!err){
                var obj=querystring.parse(obj_s);
                var sql1='UPDATE user SET username="'+obj.edit_username+'",email="'+obj.edit_email+'",phone="'+obj.edit_phone+'",qq="'+obj.edit_qq+'"WHERE id='+Number(obj.edit_id)+'';
                connection.query(sql1,function (err,data){
                    if(!err&&data){
                        res.write('{"status":0,"message":"succes"}','utf-8');
                    }else{
                        console.log(err);
                        res.write('{"status":0,"message":"default"}','utf-8');
                    }
                    res.end();

                })
               var index1='UPDATE';
                console.log(sql1);
            }
            return;
        })


    }
    //数据删除部分
    if(url_value.pathname==='/delete'&&req.method==='POST'){
        var obj_s='';
        req.on('data',function (chunk){
            obj_s+=chunk;
        })
        req.on('end',function (err){
            if(!err){
                var obj=querystring.parse(obj_s);
                var sql='DELETE FROM user WHERE id='+Number(obj.edit_id)+'';
                console.log(sql);
                connection.query(sql,function(err,result){
                    if(!err&&result){
                        res.write('{"status":0,"message":"succes"}','utf-8');
                    }
                    else{
                        res.write('{"status":1,"message":"default"}','utf-8');
                    }
                    res.end();

                })

            }
        })
        return;
    }
    if(url_value.pathname==='/setcookie'&&req.method==='GET'){
        res.setHeader('Set-Cookie',cookie.serialize('sfsd',true));
        console.log('succes')
        res.end();
    }
    if(url_value.pathname==='/getcookie'&&req.method==='GET'){
        console.log(req.headers.cookie);
        //转换成对象形式输出
        var cookie_obj=cookie.parse(req.headers.cookie);
        console.log(cookie_obj)
    }
    if(url_value.pathname==='/admin.html'){
        console.log('admin111');
        if(cookie.parse(req.headers.cookie||' ').login_in=='true'){
            render('admin.html',res);
        }else {
            render('error.html',res);
        }
        return;
    }
    if(url_value.pathname==='/logout'){
        console.log('logout_succes')
        res.setHeader('Set-Cookie',cookie.serialize('login_in',""));
        render('index.html',res);

        return;
    }
    render(url_value.pathname,res);
})
function render(pathname,res){
    //ninary 二进制
    fs.readFile('./template/'+pathname,'binary',function (err,data){
        if(!err){
            res.write(data,'binary');
            res.end();
        }
    })
}

app.listen(3000,function (){
    console.log('local losten :3000');
});
