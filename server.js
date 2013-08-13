
/**
 * Module dependencies.
 */

var express = require('express')
, http = require('http')
, path = require('path')
, fs = require('fs')
, TreesModel = require('./models/treesModel.js').TreesModel;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname);
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/app' }));
app.use(express.static(path.join(__dirname, 'app')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var index = function(req, res) { res.render('index'); };
app.get('/', index);

/*
 * GET home page.
 */

app.post('/trees', function(req, res){
    treesModel.postTree({
        url: req.param('url'),
        child: req.param('child'),
        parent: req.param('parent'),
        screenshot: req.param('screenshot')
    }, function( error, docs) {
        console.log(error);
        console.log(docs);
        res.send(docs);
    });
});
app.get('/trees', function(req, res) {
    treesModel.findAll(function(error, trees) {
        res.send(trees);
    });
});

treesModel = new TreesModel('localhost', 27017);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
