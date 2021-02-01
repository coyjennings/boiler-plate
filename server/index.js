const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose_con = require('mongoose');
mongoose_con.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connnected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello Coy Jennings!')
})

app.get('/api/hello', (req, res) => {
  res.send('Welcome Coy Jennings!')
})

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "There is no user on the email list."
      })
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.json({
            loginSuccess: false,
            message: "incorrect password"
          })
        } else {
          user.generateToken((err, user) => {
            if (err) {
              return res.status(400).send(err);
            } else {
              // save token cookie
              res.cookie("x_auth", user.token)
              .status(200)
              .json({
                loginSuccess: true,
                userId: user._id
              })
            }
          })
        }
      })
    }
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id},
    { token: ""},
    (err, user) => {
      if (err) {
        return res.json({ success: false, err })
      } else {
        return res.status(200).send({
          success: true
        })
      }
    }
  );
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`boiler-plate Running at ${port}`)
})