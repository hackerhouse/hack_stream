define([
       'jquery',
       'underscore',
       'backbone',
       'models/TreeModel',
       'collections/TreesCollection',
], function($, _, Backbone, TreeModel, TreesCollection){
    var SingleTreeView = Backbone.View.extend({
        el: '#tree-container',
        render: function () {
            var that = this;

            /* no trees at the start */
            that.getTrees();
        },

        getTrees: function(){

            var that = this;
            var trees = new TreesCollection();

            trees.fetch({
                success: function(trees) {
                    $(that.el).html(trees);
                },
                error: function(response) {
                    console.log(response, "Tree Server error!");
                }
            });

        }

    });
    return SingleTreeView;
});
