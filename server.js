
//引入http、mysql 
var http=require("http")
var mysql=require("mysql")
var util=require("util")
var url=require("url")

//连接数据库
var connection=mysql.createConnection({
    host:'localhost',
    user:'taxi',
    password:'taxi',
    port:'3306',
    database:'taxi',
    dateStrings:true  //这句不能少，否自datatime类型显示有问题
});
connection.connect(); //链接数据库（不要每次都在onRequestL里面链接）


//响应函数
function onRequest(request,response){

    response.writeHead(200,{"Content-Type":'text/plain','charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'}); 
   
    var params=url.parse(request.url,true).query;  //解析jquery传入的参数
	
	if(params.type=="queryTaxi"){
    number=params.num;
	 var startTime="2018-04-01 "+params.startTime;
     var endTime="2018-04-01 "+params.endTime;
    console.log(number);
    var sql='select longitude,latitude,alert,empty,lamp,road,speed from hour11 where number='+number+" and time between "+JSON.stringify(startTime)+" and "+JSON.stringify(endTime)+' limit 60';

    console.log(sql);
    //查询数据库  'select*from hour11 where number=20192 limit 59691'
    connection.query(sql,function(error,result){
        if(error){
            console.log("链接数据库出错");
        }
        var returnData=[];
        var data=[];
        data.push(Math.round(result[0].longitude*1e6));
        data.push(Math.round(result[0].latitude*1e6));
		data.push(Math.round(result[0].alert));
		data.push(Math.round(result[0].empty));
		data.push(Math.round(result[0].lamp));
		data.push(Math.round(result[0].road));
		data.push(Math.round(result[0].speed));
        for(var i=1;i<result.length;i++)
        {
           data.push(Math.round(result[i].longitude*1e6));
           data.push(Math.round(result[i].latitude*1e6));
		   data.push(Math.round(result[i].alert));
		   data.push(Math.round(result[i].empty));
		   data.push(Math.round(result[i].lamp));
		   data.push(Math.round(result[i].road));
		   data.push(Math.round(result[i].speed));
         }
        returnData.push(data);
        response.end(JSON.stringify(returnData)); 
    });
    }
    
    if(params.type=="lampStatus"){
        var startTime="2018-04-01 "+params.startTime;
        var endTime="2018-04-01 "+params.endTime;
        sql="select count(lamp) from hour11 where time between "+JSON.stringify(startTime)+" and "+JSON.stringify(endTime)+" group by lamp";
        //查询数据库  
        connection.query(sql,function(error,result){
            if(error){
                console.log("链接数据库出错");
            }
    
            var returnData=[];
           for(var i=0;i<result.length;i++)
                returnData.push(result[i]['count(lamp)']);

            response.end(JSON.stringify(returnData)); 
            //console.log(returnData);
            //response.end(JSON.stringify(result));  //JSON.stringify()将数组转换为json格式
        });

        console.log(sql+"  done!");


    }

    if(params.type=="carryPassengerStatus"){
        var startTime="2018-04-01 "+params.startTime;
        var endTime="2018-04-01 "+params.endTime;
        sql="select count(empty) from hour11 where time between "+JSON.stringify(startTime)+" and "+JSON.stringify(endTime)+" group by lamp";
        //查询数据库  
        connection.query(sql,function(error,result){
            if(error){
                console.log("链接数据库出错");
            }
    
            var returnData=[];
           for(var i=0;i<result.length;i++)
                returnData.push(result[i]['count(empty)']);

            response.end(JSON.stringify(returnData)); 
            //console.log(returnData);
            //response.end(JSON.stringify(result));  //JSON.stringify()将数组转换为json格式
        });

        console.log(sql+"  done!");

    }
	
	if(params.type=="showSpeedStatus"){
       var startTime="2018-04-01 "+params.startTime;
        var endTime="2018-04-01 "+params.endTime;
		var num=params.num;
        sql="select time,speed from hour11 where number="+num+" and time between "+JSON.stringify(startTime)+" and "+JSON.stringify(endTime);
        //查询数据库  
        connection.query(sql,function(error,result){
            if(error){
                console.log("链接数据库出错");
            }
    
            var returnData=[];
           for(var i=0;i<result.length;i++){
			   returnData.push(result[i]['time']);
                returnData.push(result[i]['speed']);
		   }
            response.end(JSON.stringify(returnData)); 
            //console.log(returnData);
            //response.end(JSON.stringify(result));  //JSON.stringify()将数组转换为json格式
        });

        console.log(sql+"  done!");

    }
	
	if(params.type=="showHeatMap"){
       var startTime="2018-04-01 "+params.startTime;
        var endTime="2018-04-01 "+params.endTime;
		var num=params.num;
        sql="select longitude,latitude from hour11 where time between "+JSON.stringify(startTime)+" and "+JSON.stringify(endTime);
        //查询数据库  
        connection.query(sql,function(error,result){
            if(error){
                console.log("链接数据库出错");
            }
    
            var returnData=[];
           for(var i=0;i<result.length;i++){
			   returnData.push(result[i]['longitude']);
                returnData.push(result[i]['latitude']);
		   }
            response.end(JSON.stringify(returnData)); 
            //console.log(returnData);
            //response.end(JSON.stringify(result));  //JSON.stringify()将数组转换为json格式
        });

        console.log(sql+"  done!");

    }
}

//创建服务器
http.createServer(onRequest).listen(3000);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:3000/');
