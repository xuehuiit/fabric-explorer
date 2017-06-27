
module.exports = function(id) {
	var extended = {
		title: 'Users',
		size: 'small',
		widgetId: id,

		hideLink: true,

		template: _.template('<div class="users"> <table class="table"> <tbody>' +
				'<tr> <td>Name</td> <td><%= name %></td> </tr>' +
				'<tr> <td>Role</td> <td><%= role %></td> </tr>' +
				'<tr> <td>ID</td> <td><%=id%> </td> </tr>' +
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
				name: this.data.name,
				role: this.data.role,
				id: this.data.id
			}) );

			this.postRender();
			$(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);
		},
	};

	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
