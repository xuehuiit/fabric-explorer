/**
 * Created by shouhewu on 6/8/17.
 */
var express = require("express");
var app = express();

var query=require('./app/query.js')

//指定模板引擎
app.set("view engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/views');

//利用模板文件home.ejs渲染为html
app.get("/", function(req, res) {
    res.render('home.ejs', {
        name: 'tinyphp'
    });
});

var server = app.listen(8080, function() {
    console.log("请在浏览器访问：http://localhost:8080/");
});

