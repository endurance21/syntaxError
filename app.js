const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "devu1099",
  database: "users"
});

db.connect(function(err) {
  if (err) {throw err};
  console.log("Connected!");
  db.query("SELECT * FROM accounts1", function(err,result,fields){
      if(err) {throw err};
    //   console.log(result[1]);
  })
});


const app = express();

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret : "tray"}));

app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug' );

app.get('/',function(req,res){
    if (req.session.loggedin) {
        res.render('index' , {
            title : `hello ${req.session.name}`
        });    
    }else{
        res.send("you need to log in first");
    }
    
});

app.get('/login',function(req,res){
    res.render('login' , {
        title : `hey`
    });
});

app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.Password;
    console.log(req.body);
    
    if (username && password) {
        db.query('SELECT username, password FROM accounts1 WHERE username = ? AND password = ?', [username,password], function(err,result,fileds){
            if (err) {
                throw err;   
            }
            if(result.length > 0){
                console.log('found');
                req.session.name = username;
                req.session.loggedin = true;
                res.redirect('/');
                return;
            }else{
                console.log(result);
                
                res.send('incorrect username password');
            };
            res.end();
        });
    }
    else{
        console.log("error");
        res.end();
    }
    //res.send(req.body.username);
    // res.redirect('/');
    // return;
});

app.listen(3000, function(){
    console.log("listening");
} );