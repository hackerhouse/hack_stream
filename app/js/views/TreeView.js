define([
  'jquery',
  'underscore',
  'backbone',
  'views/trees/SingleTreeView',
  'text!templates/treeSpaceTemplate.html'
], function($, _, Backbone, SingleTreeView, treeSpaceTemplate){
  
  var TreeView = Backbone.View.extend({
    
    el: '.page',
    
    render: function () {
      
      $(this.el).html(treeSpaceTemplate);
      
      // Create new Backbone views using the view manager (does some extra goodies);
      var singleTreeView = new SingleTreeView();
      singleTreeView.render();
      
    }
  });

  return TreeView;
  
});
