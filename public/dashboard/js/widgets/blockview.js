
module.exports = function(id) {
	var extended = {
		name: 'blockview',
		title: 'Blockview',
		size: 'small',
		widgetId: id, //needed for dashboard

		hideLink: true,


		template: _.template(
			'  <div class="form-group">' +
			'    <label for="block-id">Identifier [number, hash, tag]</label>' +
			'    <input type="text" class="form-control" id="block-id">' +
			'  </div>'+
			'  <div class="radio">' +
			'    <label>' +
			'      <input type="radio" id="searchType" name="searchType" value="block" checked="checked"/>' +
			'      Block' +
			'    </label>' +
			'  </div>' +
			'  <div class="radio">' +
			'    <label>' +
			'      <input type="radio" id="searchType" name="searchType" value="txn"/>' +
			'      Transaction' +
			'    </label>' +
			'  </div>' +
			'  <div class="form-group pull-right">' +
			'    <button type="button" class="btn btn-primary">Find</button>' +
			'  </div>'+
			'  <div id="notification">' +
			'  </div>'),

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
