

/**
 *
 * @param method    方法
 * @param url       地址
 * @param u_login   发送的请求
 * @param true_false    是否异步
 * @param succes         执行函数
 * @constructor
 */
function Ajax_demo(options){
    //给method方法默认值
    console.log(options.method+"----");
    var method=options.method||'get';
    var xhr=null;
    try{
        var xhr=new XMLHttpRequest();
    }catch(e){
        var xhr=new ActiveXObject('Microsoft.XMLHTTP');
    }
    if(method==='get'){
        xhr.open(method,options.url+"?"+options.u_login,options.true_false);
        xhr.send();
    }else if(method==='post'){
        xhr.open(method,options.url,options.true_false);
        xhr.send(options.u_login);
    }else{
        console.log('请求方式不正确')
    }

    xhr.onreadystatechange=function (ev){
        if (xhr.readyState===4&&xhr.status===200){
            var arr=JSON.parse(xhr.responseText);
            options.succes&&options.succes(arr);

        }
    }
}
