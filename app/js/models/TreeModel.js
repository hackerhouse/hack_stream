define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var TreeModel = Backbone.Model.extend({
      url: 'http://localhost:3000/trees'
  });
  console.log('treemodel:');
  console.log(TreeModel);
  return TreeModel;
});
