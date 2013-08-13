
define([
  'jquery',
  'underscore',
  'backbone',
  'views/MainView', 
  'views/TreeView'
], function ($, _, Backbone, MainView, TreeView) {
  
  var MainRouter = Backbone.Router.extend({
    routes: {
      '*actions': 'defaultAction',
      'messages': 'showMessageAboutMongo', // All urls will trigger this route
      'about': 'showAbout' 
    }
  });

  var initialize = function(){
		
    // var vent = _.extend({}, Backbone.Events);
    var router = new MainRouter();

    console.log("MainRouter / initialize");

		router.on('route:defaultAction', function (actions) {

        var mainView = new MainView();
        mainView.render();

        var treeView = new TreeView();
        treeView.render();

        console.log("default route");
        
		});

    router.on('route:showMessageAboutMongo', function () {

      console.log("display helpful message about setting up mongo");
        
    });

    router.on('route:showAbout', function () {

      console.log("display about");
        
    });

    Backbone.history.start();
    
  };
  return {
    initialize: initialize
  };
});
