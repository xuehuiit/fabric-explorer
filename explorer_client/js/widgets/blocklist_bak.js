
module.exports = function(id) {
	var extended = {
		name: 'blocklist',
		title: 'Blocklist',
		size: 'small',
		widgetId: id, //needed for dashboard

		hideLink: true,


		template: _.template('<div class="info-table"> <table style="width: 100%; table-layout: fixed;" class="table table-striped">' +
			'<thead style="font-weight: bold;">'+
			'<tr><td>Block</td><td>TXNs</td><td>nums</td></tr>'+
			'</thead>'+
			'<tbody>'+
			'<tr> <td>#1</td> <td><%= app %></td><td>12</td></tr>' +
			'<tr> <td>#2</td> <td><%= numUser %></td> <td>12</td></tr>' +
			'<tr> <td>#3</td> <td><a href=""><%= url %></a></td><td>12</td></tr>' +
			'<tr> <td>#4</td> <td><%=desc%> </td> <td>12</td></tr>' +
			'</tbody> </table> <div>'),

		init: function(data) {
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


		render: function() {
			Dashboard.render.widget(this.name, this.shell.tpl);
			this.fetch();

			$('#widget-' + this.shell.id).css({
				'height': '240px',
				'margin-bottom': '10px',
				'overflow-x': 'hidden',
				'width': '100%'
			}).html( this.template({
				app: 'dddd',
				desc: 'dddd',
				numUser: 'dddd',
				url: 'dddd'
			}) );

			this.postRender();
			$(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);

			$('#widget-' + this.shell.id).on('click', 'a', this.showBlock);
		},

		showBlock:function (e) {

			e.preventDefault();

			Dashboard.show({ widgetId: 'blockinfo', section: 'channel', data: {a:'ddd',b:'bbb'}, refetch: true });
		}
	};


	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
