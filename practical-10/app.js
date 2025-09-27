var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fs = require("fs");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Route to view log file
app.get("/view-log", function (req, res) {
  // Change the log file path as needed
  const logFile = path.join(__dirname, "server-error.log.txt");
  fs.readFile(logFile, "utf8", (err, data) => {
    if (err) {
      let message = "Log file not found or inaccessible.";
      if (err.code !== "ENOENT") {
        message = "Error reading log file: " + err.message;
      }
      return res.render("view-log", { logContent: null, error: message });
    }
    res.render("view-log", { logContent: data, error: null });
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
