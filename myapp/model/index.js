const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'project';

var db;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to server");
 
  db = client.db(dbName);
});


var cname;
var pname=[];
var pstory=[];

var express = require('express');
var router = express.Router();

const model = require('../model/index');

/* GET home page. */
router.route('/')

.get(function(req, res, next) {
  res.render('main');
})

router.post('/move_process',function(req, res, next) {
  console.log('post 호출');
  var name = req.body.name;
  var id = req.body.id;
  var pw = req.body.pw;

  console.log('adduser 호출됨');
  var users = db.collection('users');

  users.insert({'name': name, 'id': id, 'passwords': pw},function(err, ressult) {
      if(err) {
          console.log('err: ', err);
      } else {
          console.log('유저 생성 성공');
          res.render('login.ejs');
      }
  });
});

// router.route('/login.ejs')
// .get(function(req, res, next) {
//   res.render('login');
// })

router.post('/login_process',function(req, res, next) {
  console.log('post 호출');
  var id = req.body.id;
  var pw = req.body.pw;
  //model.login(id, pw);

  db.collection('users').findOne({'id':id, 'passwords': pw},function(err,result){
    if(err) console.log(err);
    else{
      if(result != null){
        console.log('로그인 성공');
        cname = result.name;
        
        res.render('postboard',{id:result.name,pname:0});
      } 
      else {
        console.log('로그인 실패');
        res.render('login'); 
      }
    }
  });
});

router.post('/postboard_process',function(req, res, next) {
  var postman = req.body.postman;
  var story = req.body.story;

  db.collection('board').insertOne({'postman':postman, 'story': story},function(err,result){
    if(err) console.log(err.message);
  });
  db.collection('board').find({}).toArray(function(err,result){
    console.log('비교완료');
    if(err)console.log(err.message);
    else{
      for(var i=0;i<result.length;i++){
        pname[i]=result[i].postman;
        pstory[i]=result[i].story;
      }
      for(vari=0;i<result.length;i++){
        console.log(pname[i]);
      }
      var obj = {id:cname,pname:pname,pstory:pstory};
      res.render('postboard',obj);
    }
  });
  
});
module.exports = router;
