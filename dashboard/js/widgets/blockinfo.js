import common from '../common';

module.exports = function(id) {
	var extended = {
		name: 'blockinfo',
		title: 'blockinfo',
		size: 'medium',
		widgetId: id, //needed for dashboard

		hideLink: true,

		customButtons: '<li><i class="add-account fa fa-expand"></i></li>',

		template: _.template('<div class="info-table"> <table class="table table-striped"> ' +
			''+
			'<tbody><tr> <td>App Name</td> <td><%= app %></td> </tr>' +
			'<tr> <td># of Users</td> <td><%= numUser %></td> </tr>' +
			'<tr> <td>URL</td> <td><a href="">11111</a></td> </tr>' +
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
				app: 'test1',
				desc: 'testdata1',
				numUser: 'dddd'
			}) );

			var _this = this;
			$('#widget-shell-' + _this.shell.id + ' i.add-account').click(function(e) {
				$.when(

				).done(function() {
					openblockdetail('12');
				});

			});

			this.postRender();
			$(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);


		},
	};


	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
