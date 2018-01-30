
module.exports = function(id) {
	var extended = {
		name: 'channellist4peer',
		title: 'channel list',
		size: 'large',
		widgetId: id, //needed for dashboard

		hideLink: true,

        url: 'channellist4peer',

		template: _.template('<div class="info-table"> <table style="width: 100%; " class="table table-striped">' +
			'<thead style="font-weight: bold;"><tr><td>name</td><td>blocks</td><td>txs</td><td>chaincodes</td><td>keys</td></tr></thead>'+
			'<tbody><%= rows %></tbody> </table> <div>'),

		templateRow: _.template('<tr> <td><%= channelname %></td> <td><%= blocks %></td><td><%= tranmums  %></td><td><%= ccnums %></td><td><%= keynums %></td></tr>'),


        fetch: function() {
            var _this = this;
			var rows = [];

            $.when(
                utils.load({ url: this.url })
            ).done(function(data) {
				data.forEach(function (item,index) {
					rows.push(_this.templateRow(item))
                })

				$('#widget-' + _this.shell.id).html( _this.template({ rows: rows.join('') }) );
				_this.postFetch();
            });
        }

	};


	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
