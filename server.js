var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
const mongoose = require('mongoose');
// const config = require('config');
const session = require('express-session');

require('dotenv').config();

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
let householdRouter = require('./routes/household');
let choresRouter = require('./routes/chores');
let inventoryRouter = require('./routes/inventory');



var app = express();
const port = process.env.PORT || 5000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const uri = process.env.MONGOLAB_URI;
// const uri = config.get('MONGOLAB_URI');
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/household', householdRouter);
app.use('/chores', choresRouter);
app.use('/inventory', inventoryRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;
