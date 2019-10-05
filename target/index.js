'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _users = require('./controllers/users.js');

var _users2 = _interopRequireDefault(_users);

var _chats = require('./controllers/chats');

var _chats2 = _interopRequireDefault(_chats);

var _databaseConfig = require('./config/databaseConfig');

var _databaseConfig2 = _interopRequireDefault(_databaseConfig);

var _scheduler = require('./utils/scheduler');

var _scheduler2 = _interopRequireDefault(_scheduler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;

require('./config/passport');

app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

app.set('view engine', 'ejs');

_mongoose2.default.connect(_databaseConfig2.default.mongoDbUrl, { keepAlive: 300000, connectTimeoutMS: 30000, useNewUrlParser: true, useUnifiedTopology: true });
var conn = _mongoose2.default.connection;
conn.on('error', console.error.bind(console, 'connection error:'));

app.use('/', _chats2.default);
app.use('/users', _users2.default);

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/dashboard', function (req, res) {
    res.render('dashboard');
});

(0, _scheduler2.default)();
//listen to the port
app.listen(port, function () {
    console.log('Node server listening on port ' + port);
});
//# sourceMappingURL=index.js.map