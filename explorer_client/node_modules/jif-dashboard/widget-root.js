/*
	Loading Flow
	------------
	1. Add widget to a section for displaying
	2. Widget is registered
	3. addWidget in dashboard-core is called from the widget
	4. Dashboard calls widget.init
	5. widget.setData is called by widget.init
	6. widget.ready is called by widget.init
	7. widget.render is called by widget.init
	8. widget.fetch is called by widget.render
	9. widget.postRender is called by widget.render
	10. widget.subscribe is called by widget.init
*/

window.widgetRoot = {
	hideLink: false,
	hideRefresh: false,
	refreshOnStart: false,

	initialized: false,

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

		// Tag the widget with appropriate service
		if(data.service) {
			$('#widget-shell-' + this.shell.id).data('service', data.service);
		} else {
			$('#widget-shell-' + this.shell.id).data('service', '_common');
		}
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
		$(document).trigger('WidgetInternalEvent', ['widget|rendered|' + this.name]);
	},

	_$: function(id) {
		if (id !== undefined) {
			return $('#widget-' + this.shell.id).find(id);
		} else {
			return $('#widget-' + this.shell.id);
		}
	},

	postRender: function() { },

	refresh: _.debounce(function() {
		this.fetch();
	}, 100),
};
