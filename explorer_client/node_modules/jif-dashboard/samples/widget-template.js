

widget = function() {
	var extended = {
		name: 'widget-id',
		title: 'Widget Name That Appears on it',
		size: 'small', // 'small', 'medium', 'large', 'third'

		url: 'api/block/test',
		topic: '/topic/block',

		hideLink: true,
		hideRefresh: true,

		initialized: false,

		template: _.template('<ul class="widget-node-control">'+ // internal template
				'<li>List item 1</li>'+
				'<li>List item 2</li>'+
				'<li>List item 2</li>'+
				'<li>List item 2</li>'+
			'</ul>'),

		ready: function() {
			this.render();
		},

		setData: function(data) {
			this.data = data;
		},

		fetch: function() {
			this.postFetch();
		},

		postFetch: function() { },

		subscribe: function() { },

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
				customButtons: this.customButtons
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
			});

			this.postRender();
			$(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);
		},

		postRender: function() { // executed when placing on screen
			$('#widget-' + this.shell.id).html(this.template({}));
			$('#widget-' + this.shell.id + ' button').click(this._handler);
		},

	};


	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
