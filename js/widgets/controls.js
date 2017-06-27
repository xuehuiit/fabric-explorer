
module.exports = function(id) {
	var extended = {
		title: 'Control Panel',
		size: 'third',
		widgetId: id,

		hideLink: true,

		template: _.template('<div class="controls-container"><ul>' +
				'<li><button class="btn btn-default"><i class="fa fa-bolt"></i>Button 1</button></li>' +
				'<li><button class="btn btn-default"><i class="fa fa-times"></i>Button 2</button></li>' +
				'<li><button class="btn btn-default"><i class="fa fa-trash"></i>Button 3</button></li>' +
			'</ul></div>'),

		render: function() {
			Dashboard.render.widget(this.name, this.shell.tpl);

			this.fetch();

			$('#widget-' + this.shell.id).css({
				'height': '240px',
				'margin-bottom': '10px',
				'overflow-x': 'hidden',
				'width': '100%'
			}).html( this.template() );

			this.postRender();
			$(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);
		}
	};

	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
