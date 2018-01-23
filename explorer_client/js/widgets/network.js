var DataSet = require('vis/lib/DataSet');
var Network = require('vis/lib/network/Network');

module.exports = function (id) {
    var extended = {
        name: 'network',
        title: 'network',
        size: 'large',
        widgetId: id, //needed for dashboard

        hideLink: true,

        init: function (data) {
            Dashboard.Utils.emit('widget|init|' + this.name);

            if (data) {
                this.setData(data);
            }

            this.shell = Dashboard.TEMPLATES.widget({
                name: this.name,
                title: this.title,
                size: this.size,
                hideLink: this.hideLink,
                hideRefresh: this.hideRefresh,
                customButtons: this.customButtons,
                details: true
            });

            this.initialized = true;

            Dashboard.Utils.emit('widget|ready|' + this.name);

            this.ready();

            Dashboard.Utils.emit('widget|render|' + this.name);

            this.subscribe();
        },


        render: function () {
            Dashboard.render.widget(this.name, this.shell.tpl);
            this.fetch();

            var nodes = new DataSet([
                {id: 1, label: 'CA', font:{size:30}, shape: 'circle'},
                {id: 2, label: 'Orderer' , font:{size:30}, shape: 'ellipse' },
                {id: 3, label: 'peer1' ,font:{size:30}, shape: 'box'   },
                {id: 4, label: 'peer2' ,font:{size:30}, shape: 'box' },
                {id: 5, label: 'peer3',font:{size:30}, shape: 'box' },
                {id: 6, label: 'peer4',font:{size:30}, shape: 'box' },
                {id: 7, label: 'peer5',font:{size:30}, shape: 'box' },
                {id: 8, label: 'peer6',font:{size:30}, shape: 'box' },
                {id: 9, label: 'peer7',font:{size:30}, shape: 'box' }
            ]);

            // create an array with edges
            var edges = new DataSet([
                {from: 3, to: 2, arrows:'to'},
                {from: 4, to: 2, arrows:'to'},
                {from: 5, to: 2, arrows:'to'},
                {from: 6, to: 2, arrows:'to'},
                {from: 7, to: 2, arrows:'to'},
                {from: 8, to: 2, arrows:'to'},
                {from: 9, to: 2, arrows:'to'}
            ]);

            // create a network
            var container = document.getElementById('widget-' + this.shell.id);

            // provide the data in the vis format
            var data = {
                nodes: nodes,
                edges: edges
            };
            var options = {


                "interaction": {

                    "zoomView": false   //控制是否被移动
                },

            };

            // initialize your network!
            var network = new Network(container, data, options);


            this.postRender();
            $(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);
        },
    };


    var widget = _.extend({}, widgetRoot, extended);

    // register presence with screen manager
    Dashboard.addWidget(widget);
};
