// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
    paths: {
        // Major libraries
        jquery: 'libs/jquery/jquery-min',
        underscore: 'libs/underscore/underscore-min', // https://github.com/amdjs
        backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs
        d3: 'bower_components/d3/d3.min',

        // Require.js plugins
        text: 'libs/require/text',

        // Just a short cut so we can put our html outside the js dir
        // When you have HTML/CSS designers this aids in keeping them out of the js directory
        templates: '../templates'
    },
    shim: {
        d3: {
            exports: 'd3'
        }
    }

});

// Let's kick off the application

require([
        'router/MainRouter', 'd3'
], function(MainRouter){

    (function($){

        var Resource = Backbone.Model.extend({
        });

        var Tree = Backbone.Collection.extend({
            url: '/trees',
            model: Resource
        });

        var ResourceView = Backbone.View.extend({
            tagName: 'li', // name of tag to be created        

            events: {
                'click span.delete': 'remove'
            },    

            initialize: function(){
                _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here

                this.model.bind('change', this.render);
            },

            render: function(){
                $(this.el).html('<div class="resourceNode">'+JSON.stringify(this.model.toJSON())+ '<span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span>');

                return this; // for chainable calls, like .render().el
            }
        });


        var TreeView = Backbone.View.extend({
            el: $('body'), // el attaches to existing element
            events: {
                'click button#add': 'addResource'
            },
            initialize: function(){
                var self = this;
                _.bindAll(this, 'render', 'addResource', 'appendResource'); // every function that uses 'this' as the current object should be in here

                this.collection = new Tree();
                this.collection.fetch();
                this.collection.bind('add', this.appendResource); // collection event binder

                this.counter = 0;
                this.collection.on('reset', self.render);
            },
            render: function(){
                var self = this;
                $(this.el).append("<button id='add'>Add Resource Node</button>");
                $(this.el).append("<ul></ul>");
                _(this.collection.models).each(function(resource){ // in case collection is not empty
                    self.appendResource(resource);
                }, this);
                (function() {

                    // Eye-candy meaningless tree. We'll plug it in later.
                    var width = $(window).width(),
                    height =$(window).height();

                    var tree = d3.layout.tree()
                    .size([width - 20, height - 20]);

                    var root = {},
                    nodes = tree(root);

                    root.parent = root;
                    root.px = root.x;
                    root.py = root.y;

                    var diagonal = d3.svg.diagonal();

                    var svg = d3.select("body").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(10,10)");

                    var node = svg.selectAll(".node"),
                    link = svg.selectAll(".link");

                    var duration = 750,
                    timer = setInterval(update, duration);

                    function update() {
                        if (nodes.length >= 500) return clearInterval(timer);

                        // Add a new node to a random parent.
                        var n = {id: nodes.length},
                        p = nodes[Math.random() * nodes.length | 0];
                        if (p.children) p.children.push(n); else p.children = [n];
                        nodes.push(n);

                        // Recompute the layout and data join.
                        node = node.data(tree.nodes(root), function(d) { return d.id; });
                        link = link.data(tree.links(nodes), function(d) { return d.source.id + "-" + d.target.id; });

                        // Add entering nodes in the parent’s old position.
                        node.enter().append("circle")
                        .attr("class", "node")
                        .attr("r", 4)
                        .attr("cx", function(d) { return d.parent.px; })
                        .attr("cy", function(d) { return d.parent.py; });

                        // Add entering links in the parent’s old position.
                        link.enter().insert("path", ".node")
                        .attr("class", "link")
                        .attr("d", function(d) {
                            var o = {x: d.source.px, y: d.source.py};
                            return diagonal({source: o, target: o});
                        });

                        // Transition nodes and links to their new positions.
                        var t = svg.transition()
                        .duration(duration);

                        t.selectAll(".link")
                        .attr("d", diagonal);

                        t.selectAll(".node")
                        .attr("cx", function(d) { return d.px = d.x; })
                        .attr("cy", function(d) { return d.py = d.y; });
                    }
                })()
            },
            addResource: function(){
                this.counter++;
                var resource = new Resource();
                resource.set({
                    resource_url: null,
                    id: null,
                    parent: null,
                    child: null,
                    screenshot: null,
                    new_tab: null,
                    created_at: null
                });
                this.collection.add(resource);
            },
            appendResource: function(resource){
                var resourceView = new ResourceView({
                    model: resource
                });
                $('ul', this.el).append(resourceView.render().el);
            }
        });

        var treeView = new TreeView();
    })(jQuery);

});
