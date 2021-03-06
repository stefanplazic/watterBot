import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import logger from 'morgan';
import mongoose from 'mongoose';
import usersController from './controllers/users.js';
import chatsController from './controllers/chats';
import databaseConfig from './config/databaseConfig';
import scheduler from './utils/scheduler';

const app = express();
const port = process.env.PORT || 3000;


require('./config/passport');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

mongoose.connect(databaseConfig.mongoDbUrl, { keepAlive: 300000, connectTimeoutMS: 30000, useNewUrlParser: true, useUnifiedTopology: true });
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));

app.use('/', chatsController);
app.use('/users', usersController);

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/dashboard', function (req, res) {
    res.render('dashboard');
});

scheduler();
//listen to the port
app.listen(port, () => { console.log('Node server listening on port ' + port); });


