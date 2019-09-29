const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const pug = require('pug');
// const PORT = 4009;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Iamhappy2018@",
    database: "tray"
});

db.connect(function (err) {
    if (err) {
        throw err
    };
    console.log("Connected!");
    db.query("SELECT * FROM accounts1", function (err, result, fields) {
        if (err) {
            throw err
        };
        //   console.log(result[1]);
    })
});


const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "tray"
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    if (req.session.loggedin) {
        res.render('index', {
            title: `hello ${req.session.name}`
        });
    } else {
        res.render('index', {
            title: 'hello'
        });
        // res.send("you need to log in first");
    }

});

// app.get('/',function(req,res){
//     // if (req.session.loggedin) {
//     //     res.render('index' , {
//     //         title : `hello ${req.session.name}`
//     //     });    
//     // }else{
//         res.send('hello') ;
//     // }

// });

function hash() {
    return Math.random().toString(36).substring(2, 8)
}


app.post('/api/orders/create', (req, res) => {
    var order_name = req.body['order_name'],
        user_id = req.body['user_id'],
        group_id = req.body['group_id'],
        canteen_id = req.body['canteen_id'],
        item_id = req.body['item_id'];

    let order_hash = hash();
    db.query(`INSERT INTO orders (order_hash,order_name,user_id,group_id,canteen_id,item_id) VALUES ('${order_hash}','${order_name}','${user_id}', '${group_id}', '${canteen_id}','${item_id}')`, (err, result, fields) => {
        if (err) throw err;
        else {
            res.send("order created , with orde_hash: " + order_hash);
        }
    });
});
app.delete('/api/orders/delete/:hash/:item_id',(req,res)=>{
     //delete the food item from food item list
     let hashid  = req.params.hash,
     item_id = req.params.item_id;
    //  console.log(req.params);

    db.query('DELETE FROM orders_content WHERE order_hash  = ? AND item_id = ?'  , [hashid,item_id],(err,result,fields)=>{
        if (err) throw err;
        else{
            // let r  = JSON.parse(result);

            res.send(result);
        }
    });

});
app.patch('api/orders/additem',(req,res)=>{
    //update the order_content
    var order_hash = req.body['order_hash'],
    user_id = req.body['user_id'],
    canteen_id = req.body['canteen_id'],
    item_id = req.body['item_id'];
    db.query(`INSERT INTO  orders_content (order_hash,user_id,canteen_id,item_id) VALUES('${order_hash}','${user_id}','${canteen_id}','${item_id}')`,(err,result,fields)=>{
        if (err) throw err;
        else{
            res.send("your order item added sucessfully");
        }
    })

});
// app.delete('api/orders/deleteItem/:id&&',(req,res)=>{
//     //update the order_content
//     let hashid  = res.params.hash;
//     db.query(`DELETE FROM orders_content WHERE order_hash  = ${hashid}`,(err,result,fields)=>{
//         if (err) throw err;
//         else{
//             res.send("your order deleted sucessfully");
//         }
//     });
    

// });

app.get('/login', function (req, res) {
    res.render('login', {
        title: `hey`
    });
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.Password;
    console.log(req.body);

    if (username && password) {
        db.query('SELECT username, password FROM accounts1 WHERE username = ? AND password = ?', [username, password], function (err, result, fileds) {
            if (err) {
                throw err;
            }
            if (result.length > 0) {
                console.log('found');
                req.session.name = username;
                req.session.loggedin = true;
                res.redirect('/');
                return;
            } else {
                console.log(result);

                res.send('incorrect username password');
            };
            res.end();
        });
    } else {
        console.log("error");
        res.end();
    }
});

app.listen(3000, function () {
    console.log("listening");
});