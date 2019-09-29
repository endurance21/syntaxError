const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "devu1099",
  database: "tray"
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
            title : `hello ${req.session.userId}`
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
        db.query('SELECT id, username, password FROM accounts1 WHERE username = ? AND password = ?', [username,password], function(err,result,fileds){
            if (err) {
                throw err;   
            }
            if(result.length > 0){
                console.log('found');
                req.session.name = username;
                req.session.loggedin = true;
                req.session.userId = result[0].id;
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

app.get('/api/canteens',function(req,res){
    // res.render('login' , {
    //     title : `hey`
    // });
    db.query('SELECT * FROM canteens', function(err, result, fields){
        if (err) {
            throw err;
        }else{
            res.send(result);
        }
    });
});

app.get('/api/canteens/:table_name',function(req,res){
    var table_name = req.params.table_name;
    db.query(`SELECT * FROM ${table_name}` , function(err, result, fields){
        if (err) {
            throw err;
        }else{
            res.send(result);
        }
    });
});

app.post('/api/creategroup', function(req,res){
    var group_name = req.body.group_name;
    var group_code = Math.floor(100000 + Math.random() * 900000);
    
    db.query(`INSERT INTO group_table (group_id, group_name, group_code) VALUES (NULL, '${group_name}', '${group_code}')`, function(err,result,fields){
        if (err) {
            throw err;
        }else{
            res.send(`${group_code}`);
        }
    });
});
var group_id;
app.post('/api/joingroup' , function(req,res){
    var group_code = req.body.group_code;
    var member_id = req.session.userId;

    console.log(typeof member_id);
    // var group_id;

    db.query(`SELECT group_id FROM group_table WHERE group_code = ?`, [group_code] , function(err, result, fields){
        if (err) {
            throw err;
        }else{
            group_id = result[0].group_id;
            console.log(typeof group_id);
        }
    });

    // db.query("INSERT INTO group_members (group_id, member_id) VALUES ('"+group_id+"','"+ member_id+"')", function(err,result,fields){
    //     if (err) {
    //         throw err;
    //     }else{
    //         //res.send(`${group_code}`);
    //         res.end();
    //     }
    // });

});

app.post('/api/joingroups' , function(req,res){
    var member_id = req.session.userId;

    db.query("INSERT INTO group_members (group_id, member_id) VALUES ('"+group_id+"','"+ member_id+"')", function(err,result,fields){
        if (err) {
            throw err;
        }else{
            //res.send(`${group_code}`);
            res.end();
        }
    });
});

app.delete('/api/leavegroup' , function(req,res){
    var member_id = req.body.member_id;
    var group_id = req.body.group_id;

    console.log(group_id,member_id)

    db.query("DELETE FROM group_members WHERE group_id = ? AND member_id = ?", [group_id,member_id] ,function(err,result,fields){
        if (err) {
            throw err ;
        }else{
            console.log(result);
        }
    });
});


app.listen(3000, function(){
    console.log("listening");
} );