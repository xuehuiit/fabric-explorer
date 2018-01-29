
module.exports = function(id) {
	var extended = {
		name: 'peerlist',
		title: 'peerlist',
		size: 'medium',
		widgetId: id, //needed for dashboard

		hideLink: true,

        url: 'peerlist',

        template: _.template('<div class="info-table"> <table style="width: 100%; " class="table table-striped">' +
            '<thead style="font-weight: bold;">' +
            '<tr><td>name</td><td>request</td><td>hostname</td></tr>' +
            '</thead>'+
            '<tbody><%= rows %></tbody> </table> <div>'),

        templateRow: _.template('<tr><td><%= name %></td><td><%= requests %></td><td><%= serverhostname %></td></tr>'),


        fetch: function() {
            var _this = this;
            var rows = []

            $.when(
                utils.load({ url: this.url })
            ).done(function(data) {
                data.forEach(function (item,index) {
                    rows.push(_this.templateRow(item))
                })

                $('#widget-' + _this.shell.id).css({"overflow-x":"auto"});
                $('#widget-' + _this.shell.id).html( _this.template({ rows: rows.join('') }) );
                _this.postFetch();
            });
        }
	};


	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
