
module.exports = function(id) {
	var extended = {
		name: 'chaincodelist',
		title: 'chaincode list',
		size: 'large',
		widgetId: id, //needed for dashboard

		hideLink: true,

        url: 'chaincodelist',

		template: _.template('<div class="info-table"> <table style="width: 100%; table-layout: fixed;" class="table table-striped">' +
			'<thead style="font-weight: bold;">'+
			'<tr><td width="20%">name</td><td width="10%">version</td><td width="60%">path</td><td width="10%">trans</td></tr>'+
			'</thead>'+
			'<tbody><%= rows %></tbody> </table> <div>'),

		templateRow: _.template('<tr> <td><%= channelName %></td> <td><%= version %></td><td><%= path %></td> <td><%= txCount %></td></tr>'),


        fetch: function() {
            var _this = this;
			var rows = []

            $.when(
                utils.load({ url: this.url })
            ).done(function(data) {
				data.forEach(function (item,index) {
					rows.push(_this.templateRow(item))
                })

				console.info(rows.join('') )
				$('#widget-' + _this.shell.id).html( _this.template({ rows: rows.join('') }) );
				_this.postFetch();
            });
        }

	};


	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
