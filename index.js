const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
// app.use(express.json());
// app.use(express.urlencoded());

app.use(session({secret : "randanshu"}));


app.get('/', function(req, res){
    if(req.session.page_views){
       req.session.page_views++;
       res.send("You visited this page " + req.session.page_views + " times");
       console.log(req.session)
    } else {
       req.session.page_views = 1;
       res.send("Welcome to this page for the first time!");
    }
 });


app.post('/', function(req,res){
    console.log(req.body.name);
    const course = {
        name : req.body.name
    };
    console.log(course);
    res.send(course);
    // res.end(course);
    // res.send('POST request to homepage');
    // if (req.params.name == 'yadav') {
        
    //     res.send("hey");
            
    // }
});

app.listen(8000, console.log("listening"));