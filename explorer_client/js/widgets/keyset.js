
module.exports = function(id) {
	var extended = {
		name: 'keyset',
		title: 'keyset',
		size: 'large',
		widgetId: id, //needed for dashboard

		hideLink: true,

        url: 'getKeyset',

		template: _.template('<div class="info-table"> <table style="width: 100%; " class="table table-striped">' +
			'<thead style="font-weight: bold;"><tr><td>channelname</td><td>chaincode</td><td>blocknum</td><td>blockhash</td><td>transactionhash</td><td>keyname</td></tr></thead>'+
			'<tbody><%= rows %></tbody> </table> <div>'),

		templateRow: _.template('<tr><td><%= channelname %></td><td><%= chaincode %></td><td><%= blocknum %></td><td><%= blockhash %></td><td><%= transactionhash %></td><td><%= keyname %></td></tr>'),


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
