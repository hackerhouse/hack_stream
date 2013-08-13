define([
  'jquery',
  'underscore',
  'backbone',
  'models/TreeModel'
], function($, _, Backbone, TreeModel){
  var TreeCollection = Backbone.Collection.extend({
    model: TreeModel,
      url: 'http://localhost:3000/trees'
  });
console.log('treeCollection inistialised');
console.log(TreeCollection.model);
  return TreeCollection;
});
