const express = require('express');
const router  = express.Router();

let user = {username: "tennessee", password: "volunteers"};


router.get('/login', authenticate, function(req, res) {
  res.render('login');
});

router.post("/login", function(req, res) {

  req.checkBody("username", "Name cannot be empty.").notEmpty();
  req.checkBody("username", 'Up to 25 characters allowed').len(8,25);
  req.checkBody("username", "Letters and Numbers only. No special characters.").isAlphanumeric();

  req.checkBody("password", "Password cannot be empty.").notEmpty();
  req.checkBody("password", '8 to 25 characters required').len(8,25);
  req.checkBody("password", "Letters and Numbers only. No special characters.").isAlphanumeric();


    let errors = req.getValidationResult();
    let messages = [];

      errors.then(function(result) {
          result.array().forEach(function(error) {
            messages.push(error.msg);
          })
          let obj = {
            errors: messages,
            info: req.body
          };

          res.render('login', obj);
        });
      });



function authenticate(req, res, next) {
  if(req.session.token) {
    res.redirect("/");
  } else {
    console.log("No token!");
    next();
  }
}


router.get('/', function(req, res, next) {
  if(req.session.token) {
    next();
  } else {
    res.redirect("/login");
  }
}, function(req, res) {
   res.render("layout", req.session.user);
});

router.post("/", function(req, res) {
  let obj = {
    username: req.body.username,
    password: req.body.password
  };

  if(obj.username == user.username && obj.password == user.password) {
    req.session.user = obj;
    req.session.token = "9a8b7c6d";
    res.redirect('/');
  }else{
    res.redirect('/login');
  }
});

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    console.log(err);
  });
  res.redirect('/login');
})

module.exports = router;
