
module.exports = function(id) {
	var extended = {
		name: 'peerlist',
		title: 'peerlist',
		size: 'medium',
		widgetId: id, //needed for dashboard

		hideLink: true,


		template: _.template('<div class="info-table"> <table style="width: 100%; table-layout: fixed;" class="table table-striped">' +
			'<thead style="font-weight: bold;"><tr><td style="width:60px;">Block</td><td>Age</td><td style="width:45px;">TXNs</td></tr></thead>'+
			'<tbody><tr> <td>App Name</td> <td><%= app %></td><td><%= app %></td> </tr>' +
			'<tr> <td># of Users</td> <td><%= numUser %></td><td><%= numUser %></td> </tr>' +
			'<tr> <td>URL</td> <td><a href=""><%= url %></a></td><td><a href=""><%= url %></a></td> </tr>' +
			'<tr> <td>Description</td> <td><%=desc%> </td> </tr>' +
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
				app: this.data.appName,
				desc: this.data.description,
				numUser: this.data.numUser,
				url: this.data.url
			}) );

			this.postRender();
			$(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);
		},
	};


	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
