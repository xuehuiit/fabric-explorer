
module.exports = function(id) {
	var extended = {
		name: 'form',
		title: 'Form',
		size: 'medium',
		widgetId: id,

		hideLink: true,

		template: _.template('<form>' +
				'<div class="form-group">' +
					'<label for="exampleInputEmail1">Email address</label>' +
					'<input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">' +
				'</div>' +
				'<div class="form-group">' +
					'<label for="address">Address</label>' +
					'<input type="text" class="form-control" id="address" placeholder="Address">' +
				'</div>' +
					'<div class="form-group">' +
					'<label for="exampleInputFile">File input</label>' +
					'<input type="file" id="exampleInputFile">' +
				'</div>' +
				'<div class="checkbox">' +
					'<label>' +
					'<input type="checkbox"> Check me out' +
					'</label>' +
				'</div>' +
				'<button type="submit" class="btn btn-default">Submit</button>' +
			'</form>'),

		render: function() {
			Dashboard.render.widget(this.name, this.shell.tpl);
			this.fetch();

			$('#widget-' + this.shell.id).css({
				'height': '240px',
				'margin-bottom': '10px',
				'overflow-x': 'hidden',
				'width': '100%'
			}).html( this.template());

			this.postRender();
			$(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);
		}
	}

	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);

}
