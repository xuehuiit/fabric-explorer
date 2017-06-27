
module.exports = function(id) {
	var extended = {
		title: 'Date',
		size: 'third',
		widgetId: id,

		hideLink: true,

		template: _.template('<div class="date-container"><div><%=month%> / <%=day%></div> <div><%=year%></div></div>'),

		render: function() {
			Dashboard.render.widget(this.name, this.shell.tpl);

			this.fetch();

			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
			    dd='0'+dd
			}

			if(mm<10) {
			    mm='0'+mm
			}

			today = mm+'/'+dd+'/'+yyyy;

			$('#widget-' + this.shell.id).css({
				'height': '240px',
				'margin-bottom': '10px',
				'overflow-x': 'hidden',
				'width': '100%'
			}).html( this.template({
				date: today,
				month: mm,
				day: dd,
				year: yyyy
			}) );

			this.postRender();
			$(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);
		},
	};

	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
