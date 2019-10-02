import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import logger from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(mongoSanitize());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.json({ "tutorial": "Build REST API with node.js" });
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.send(err);
    //save errors to loger
    console.log(err);

});

//listen to the port
app.listen(port, function () { console.log('Node server listening on port 3000'); });