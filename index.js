const express = require('express');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const session = require('express-session');

const PORT = 8090;

const path = require('path');

const app = new express();

const router = require('./router/index');

app.use(bodyParser.json());

app.use(
	bodyParser.urlencoded(
		{
			extended: true
		}
	)
)

app.use(function(req, res, next) {
    console.log(req.method, req.url)
    next();
})

app.use(express.static(path.join(__dirname, 'views')));

app.use('/', router);

app.set('view engine', 'pug');
app.set('views', 'views');

app.set('port', PORT);

var server = app.listen(
	app.get('port'), function() {
		var port = server.address().port;
		console.log("Server is running on port: " + port);
	}
);