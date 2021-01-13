var express = require("express"), 
    mongoose = require("mongoose"), 
    passport = require("passport"), 
    bodyParser = require("body-parser"), 
    LocalStrategy = require("passport-local"), 
    passportLocalMongoose =  
        require("passport-local-mongoose"), 
    User = require("./models/user"); 
 
var multer = require('multer');
var path = require('path');
var Details = require('./models/details');

mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true); 
mongoose.connect("mongodb://localhost/gallerie_utilisateur");

var app = express(); 
app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({ extended: true })); 
  
app.use(require("express-session")({ 
    secret: "Rusty is a dog", 
    resave: false, 
    saveUninitialized: false
})); 
  
app.use(passport.initialize()); 
app.use(passport.session()); 
  
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 
  
//===================== 
// ROUTES 
//===================== 
  
// Showing home page 
app.get("/", function (req, res) { 
    res.render("home"); 
}); 
  
// Showing secret page 
/*app.get("/secret", isLoggedIn, function (req, res) { 
    res.render("secret"); 
});*/
app.get("/index", isLoggedIn, function (req, res) { 
    res.render("index"); 
}); 
  
// Showing register form 
app.get("/register", function (req, res) { 
    res.render("register"); 
}); 
  
// Handling user signup 
app.post("/register", function (req, res) { 
    var username = req.body.username 
    var password = req.body.password 
    User.register(new User({ username: username }), 
            password, function (err, user) { 
        if (err) { 
            console.log(err); 
            return res.render("register"); 
        } 
  
        passport.authenticate("local")( 
            req, res, function () { 
            //res.render("secret");
            res.render("index"); 
        }); 
    }); 
}); 
  
//Showing login form 
app.get("/login", function (req, res) { 
    res.render("login"); 
}); 
  
//Handling user login 
app.post("/login", passport.authenticate("local", { 
    //successRedirect: "/secret",
    successRedirect: "/index", 
    failureRedirect: "/login"
}), function (req, res) { 
}); 
  
//Handling user logout  
app.get("/logout", function (req, res) { 
    req.logout(); 
    res.redirect("/"); 
}); 
  
function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) return next(); 
    res.redirect("/login"); 
}


//connect mongo
mongoose.connect('mongodb://localhost/photoGallery');

// configure multer
var upload = multer({storage: multer.diskStorage({

  destination: function (req, file, callback) 
  { callback(null, './uploads');},
  filename: function (req, file, callback) 
  { 
  	callback(null, (file.originalname));
  }

}),

fileFilter: function(req, file, callback) {
  var ext = path.extname(file.originalname)
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback(/*res.end('Only images are allowed')*/ null, false)
  }
  callback(null, true)
}
});



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

//config port
app.listen(port)
console.log( `server running on -> ${port}` )


//config route

/*app.get('/', (req,res)=>{
	res.render('index')
})*/

app.post('/post', upload.any(), (req,res)=>{
  console.log("req.body"); //form fields
  console.log(req.body);
  console.log("req.file");
  console.log(req.files); //form files
// simple validation
if(!req.body && !req.files){
	res.json({success : false})
} else {

 var details = new Details ({
 
   Post_title : req.body.post_title,
   Post_image : req.files[0].filename,
   Post_comment : req.body.post_comment

 })

  details.save((err, neel)=>{
  	if(err){
  		console.log(err)
  	}else{
  		res.render('index');
  	}
  })


}
})


app.get('/blogs',(req,res)=>{
	Detail.find({},(err,data)=>{
		if(err){
			console.log(err)
		}else{
			res.render('blogs',{data:data})
		}
	})
})


  
var port = process.env.PORT || 3000; 
app.listen(port, function () { 
    console.log("Server Has Started!"); 
}); 