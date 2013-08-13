var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

TreesModel = function(host, port) {
  this.db = new Db('sessionTrees', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


TreesModel.prototype.getCollection = function(callback) {
  this.db.collection('trees', function(error, trees_collection) {
    if( error ) callback(error);
    else callback(null, trees_collection);
  });
};

// find all trees
TreesModel.prototype.findAll = function(callback) {
    this.getCollection(function(error, trees_collection) {
      if( error ) callback(error)
      else {
        trees_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

// register a new bike
TreesModel.prototype.postTree = function(trees, callback) {
    this.getCollection(function(error, trees_collection) {
      if( error ) callback(error)
      else {
        if( typeof(trees.length) == "undefined")
          trees = [trees];

        for( var i = 0; i < trees.length; i++ ) {
          tree = trees[i];
          tree.created_at = new Date();
        }

        trees_collection.insert(trees, function() {
          callback(null, trees);
        });
      }
    });
};

exports.TreesModel = TreesModel;
