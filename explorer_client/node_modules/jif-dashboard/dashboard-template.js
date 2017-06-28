window.Dashboard.TEMPLATES = {
	_widget: function(opts) {
		return '<div class="widget-shell col-lg-' + opts.largeColumn + ' col-md-' + opts.mediumColumn + ' col-xs-' + opts.smallColumn + ' ' + opts.name + '" id="widget-shell-' + opts.id + '">\n'+
				'	<div class="panel panel-default">\n'+
				'		<div class="panel-heading">\n'+
				'			<h3 class="panel-title"><span>' + opts.title + '</span></h3>\n'+
				'			<ul class="panel-action">\n'+

				( opts.customButtons ? opts.customButtons : '' ) +

				( opts.hideLink === true ? '' : '				<li><i title="Copy to clipboard" class="fa fa-link"></i></li>\n') +

				'				<li><i class="fa fa-chevron-down"></i></li>\n'+
				( opts.hideRefresh === true ? '' : '				<li><i class="fa fa-rotate-right"></i></li>\n') +

				'				<li><i class="fa fa-close"></i></li>\n'+
				'			</ul>\n'+
				'		</div>\n'+
				'		<div class="panel-body" id="widget-' + opts.id + '">\n'+
				'		</div>\n'+
				'	</div>\n'+
				'</div>';
	},

	widget: function(o) {
		var opts = _.extend({
			id: Math.ceil(Math.random() * 100000000),

			largeColumn: 3,
			mediumColumn: 4,
			smallColumn: 12
		}, o);

		switch (opts.size) {
			case 'medium':
				opts.largeColumn = 6;
				opts.mediumColumn = 12;
				opts.smallColumn = 12;

				break;

			case 'large':
				opts.largeColumn = 12;
				opts.mediumColumn = 6;
				opts.smallColumn = 12;

				break;

			case 'third':
				opts.largeColumn = 4;
				opts.mediumColumn = 6;
				opts.smallColumn = 12;

				break;
		}

		return {
			id: opts.id,
			tpl: Dashboard.TEMPLATES._widget(opts)
		};
	}
}
