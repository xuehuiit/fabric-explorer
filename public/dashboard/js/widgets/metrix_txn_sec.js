
module.exports = function(id) {
	var extended = {
		name: 'metrix_txn_sec',
		title: 'transtion sec',
		size: 'large',
		widgetId: id, //needed for dashboard

		hideLink: true,



		fetch: function() {
			$('#widget-' + widget.shell.id).html( '<div id="' + widget.name + '" class="epoch category10" style="width:100%; height: 210px;"></div>' );

			widget.chart = $('#' + widget.name).epoch({
				type: 'time.area',

				data: [
					// The first layer
					{
						label: "Layer 1",
						values: [ {time: 1370044800, y: 100}, {time: 1370044801, y: 1000}, ]
					},

					// The second layer
					{
						label: "Layer 2",
						values: [ {time: 1370044800, y: 78}, {time: 1370044801, y: 98},]
					},

				],
				axes: ['left', 'right', 'bottom']
			});
		},

		onData: function(data) {

		},
	};


	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
