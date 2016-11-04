var  User = require('../models/user');
var msg = require('../models/msg');
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');

var key = config.secretKey;

function createToken(user){
    var token = jsonwebtoken.sign({
        _id : user._id,
        name : user.name,
        username : user.username
      },key, {
        expiresIn :'1440m'
      });

      return token;
}


module.exports = function(app,express){

    var api = express.Router();
    api.post('/signup',function(req,res){
      var user = new User({
        name : req.body.name,
        username : req.body.username,
        password : req.body.password
      });

      var token = createToken(user);
      user.save(function(err){
        if(err){
          res.send(err);
          return;
        }
        res.json({
          success : true,
          message : "User Registered !!!",
          token : token
        });
      });
    });

    api.get('/users', function( req, res){
      User.find({}, function( err, users){
        if(err)  {
            res.send(err);
            return ;
        }
        res.json(users);
      });
    });

   api.post('/login',function(req, res){
       console.log(" Entered The login Function");
        User.findOne({
          username : req.body.username
        }).select('name username password').exec(function(err, user){

          if(err){
             throw err;
           }
          if(!user){
              res.send({mesasge : "User Doesnt Exist !!"});
          }else if (user) {
              var validPassword = user.comparePassword(req.body.password);

              if(!validPassword){
                res.send({message : "invalid"});
              }else{


                  var token = createToken(user);
                  res.json({
                    success : true,
                    message : "Login Successfull ....",
                    token : token
                  });
              }
            }
        });
    });

    api.use(function(req, res, next){
       console.log("Access Granted !! ");

       var token = req.body.token || req.params.token || req.query['token'] || req.headers['x-access-token'];

       if(token) {
          jsonwebtoken.verify(token, key, function (err, decoded){

            if(err) {
              res.status(403).send({success :false, message :"Failed to authenticate !"});
            } else {
              req.decoded = decoded;
              next();
            }
          });
       }else {
         res.status(403).send({ success : false, message : "No Token Existed !"});
       }
    });

   //  Token needed to reach ! ----------------
  /*  api.get('/',function(req,res){
        res.json("Token Is Genuine !");
    });*/
    api.route('/')

          .post(function(req,res){
            var Msg = new msg({
              author : req.decoded.id,
              content : req.body.content,
            });
            Msg.save(function(err){
              if(err){
                res.send(err);
                return
              }
              res.json({message : "Post Is Created !!!"});
            });
          })

          .get(function(req,res){
              msg.find ({author :req.decoded.id},function(err,msgss){
                if(err){
                  res.send(err);
                  return;
                }
                else {
                    res.json(msgss);
                  }
              });
          });

      api.get('/profile',function(req,res){
            res.json(req.decoded);
      });

    return api
}
