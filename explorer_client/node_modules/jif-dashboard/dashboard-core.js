import Packery from 'packery';
import Draggabilly from 'draggabilly';

import 'jquery';
import 'jquery-ui-dist/jquery-ui.js';

import	storageAvailable from './storage-available';

window.Dashboard = {
	// option defaults
	settings: {
		appName: 'cakeshop',
		widgetContainer: '#grounds',
		resize: true,
		drag: true,
		storage: true,
		minWidth: 200,
		minHeight: 250
	},

	// section to widget mapping
	sectionMap: {},

	// widget id to widget mapping
	idMap: {},

	// widgets that have been queued for load
	queued: [],

	// widgets that have been loaded
	loaded: {},

	// init data for widgets
	initData: {},

	// widget id to widget module
	widgetDefns: {},

	setOptions(options) {
		if (options.minWidth) {
			this.setMinWidth = true;
		}
		if (options.minHeight) {
			this.setMinHeight = true;
		}
		$.extend(this.settings, options);
	},

	preregisterWidgets(defns) {
		Object.assign(this.widgetDefns, defns);
	},

	registerWidget(widgetId) {
		var widget = {};
		try{
			widget[widgetId] = require('../../js/widgets/' + widgetId);
		} catch (e) {
			console.log('path does not exist')
		}

		Object.assign(this.widgetDefns, widget);
	},

	// debounced refreshing of the packery layout
	refresh: _.debounce(function() {
		Dashboard.grid.layout();
	}, 0),

	// DOM anchor for the widget field and packery grid
	init: function() {
		Dashboard.widgetContainer = $(this.settings.widgetContainer);
		//TODO: look into widget sizer vs options for column/row values
		Dashboard.grid = new Packery(Dashboard.widgetContainer[0], {
			columnWidth: '.widget-sizer',
			//rowHeight: '.widget-sizer',
			percentPosition: true,
			itemSelector: '.widget-shell',
			gutter: 0,
		});

		Dashboard.grid.on( 'dragItemPositioned', () => {
			const itemElems = Dashboard.grid.getItemElements(),
			 order = itemElems.map(elem => {
				var elemId = $(elem).attr('id').split('-');
				return this.idMap[elemId[elemId.length - 1]].name;
			});

			if (this.settings.drag && this.settings.storage && storageAvailable) {
				Dashboard.Utils.emit('options|drag-saved');
				const sortKey = `${Dashboard.settings.appName}:${Dashboard.section}:sort-order`;
				window.localStorage[sortKey] = JSON.stringify(order);
			} else {
				Dashboard.Utils.emit('options|drag-unsaved');
			}
		});
	},

	// Optional module to enforce placement order
	render: {
		unstub: function(id) {
			$('#stub-' + Dashboard.Utils.selectorEscape(id)).remove();
		},

		stub: function(id) {
			var el = $('<div></div>', {
				id: 'stub-' + id,
				style: 'display: none;'
			});

			Dashboard.widgetContainer.append(el);
		},

		widget: function(id, el) {
			$('#stub-' + Dashboard.Utils.selectorEscape(id)).replaceWith(el);
			Dashboard.render.unstub(id);
		}
	},

	addWidget: function(widget) {

		if (!widget.name) {
			widget.name = widget.widgetId;
		}

		// shared injects
		widget.init(this.initData[widget.name]);

		// set section widget belongs to
		_.each(this.sectionMap, function(val, section) {
			_.each(val, function(v) {
				if (widget.name == v) {
					widget.section = section;
				}
			});
		});


		// to overwrite when the widget starts if we don't want it to render
		// right away.
		// widget.ready = function() { widget.render(); };

		this.loaded[widget.name] = widget;
		this.idMap[widget.shell.id] = widget;

		this.queued = _.without(this.queued, widget.name);
		delete this.initData[widget.name];

		const shell = document.getElementById('widget-shell-' + widget.shell.id);

		if (this.settings.resize && this.settings.storage && storageAvailable) {
			const sizeKey = `${Dashboard.settings.appName}:${Dashboard.section}:sizes`;

			var size = {
				'height': $('#widget-shell-' + widget.shell.id).height(),
				'width': $('#widget-shell-' + widget.shell.id).width(),
				'panelHeight': $('#widget-shell-' + widget.shell.id + ' > .panel').height(),
				'panelWidth': $('#widget-shell-' + widget.shell.id + ' > .panel').width(),
				'contentWidth': $('#widget-' + widget.shell.id).width(),
				'contentHeight': $('#widget-' + widget.shell.id).height(),
			};

			//check if sizes have been saved
			if (window.localStorage[sizeKey] != null) {
				var sizes = JSON.parse(window.localStorage[sizeKey]);

				//check if size for specific widget is saved
				if (sizes[this.idMap[widget.shell.id].name] != undefined) {
					Dashboard.Utils.emit('options|load-size|' + widget.name);

					size = sizes[this.idMap[widget.shell.id].name];

					$('#widget-shell-' + widget.shell.id).width(size['width']).height(size['height']);
					$('#widget-shell-' + widget.shell.id + ' > .panel').height(size['panelHeight']).width(size['panelWidth']);
					$('#widget-' + widget.shell.id).height(size['contentHeight']).width(size['contentWidth']);

					if(widget.refreshOnStart) {
						widget.fetch();
					}

				} else {
					sizes[this.idMap[widget.shell.id].name] = size;
					window.localStorage.setItem(sizeKey, JSON.stringify(sizes));
				}
			} else {
				var sizes = {};
				sizes[this.idMap[widget.shell.id].name] = size;
				window.localStorage.setItem(sizeKey, JSON.stringify(sizes));
			}
		}

		// packery registration, and draggable init
		this.grid.appended(shell);

		if (this.settings.drag) {
			const draggie = new Draggabilly(shell, { handle: '.panel-heading' });
			this.grid.bindDraggabillyEvents(draggie);
		}

		if (this.settings.resize) {
			var minHeight,
				minWidth;

			if (this.setMinWidth) {
				// explicitly set width value
				minWidth = this.settings.minWidth;
			} else if ($('.widget-sizer').length) {
				// no explicitly set width, use sizer
				minWidth = $('.widget-sizer').width();
			} else {
				// not set, no sizer -> use default
				minWidth = this.settings.minWidth;
			}
			// same for height as for width
			if (this.setMinHeight) {
				minHeight = this.settings.minHeight;
			} else if ($('.widget-sizer').length) {
				minHeight = $('.widget-sizer').height();
			} else {
				minHeight = this.settings.minHeight;
			}

			$('#widget-shell-' + widget.shell.id).resizable({
				minHeight: minHeight,
				minWidth: minWidth,
				alsoResize: '#widget-shell-' + widget.shell.id + ' > .panel',
				grid: [ 5, 5 ],
				start: function(event, ui) {
					$('#widget-shell-' + widget.shell.id).css('box-sizing', 'content-box');
				},
				resize: function(event, ui) {
					/*$('#widget-' + widget.shell.id).css({
						height: ui.size.height - 100,
						width: ui.size.width - 35
					});

					$('#widget-shell-' + widget.shell.id).height($('#widget-shell-' + widget.shell.id + ' > .panel').height() + 20);
					$('#widget-shell-' + widget.shell.id).width($('#widget-shell-' + widget.shell.id + ' > .panel').width());
					*/

					$('#widget-' + widget.shell.id).css({
						height: ui.size.height - 68,
						width: ui.size.width - 5
					});

					$('#widget-shell-' + widget.shell.id).height($('#widget-shell-' + widget.shell.id + ' > .panel').height() + 20);
					$('#widget-shell-' + widget.shell.id).width($('#widget-shell-' + widget.shell.id + ' > .panel').width());

					/*
					$('#widget-shell-' + widget.shell.id).height(ui.size.height);
					$('#widget-shell-' + widget.shell.id).width(ui.size.width);

					$('#widget-' + widget.shell.id).css({
						// 68 == header 45px + margin-bottom 20px + 3px jitter space
						height: ui.size.height - 68,
						width: ui.size.width
					}); */
					widget.refresh();
					Dashboard.refresh();
				},
				stop: function( event, ui) {
					const sizeKey = `${Dashboard.settings.appName}:${Dashboard.section}:sizes`;

					if (Dashboard.settings.storage && storageAvailable && window.localStorage[sizeKey] != null) {
						Dashboard.Utils.emit('options|saved-resize|' + widget.name);

						var sizes = JSON.parse(window.localStorage[sizeKey]),
						 size = {
							'height': $('#widget-shell-' + widget.shell.id).height(),
							'width': $('#widget-shell-' + widget.shell.id).width(),
							'panelHeight': $('#widget-shell-' + widget.shell.id + ' > .panel').height(),
							'panelWidth':	$('#widget-shell-' + widget.shell.id + ' > .panel').width(),
							'contentHeight': $('#widget-' + widget.shell.id).height(),
							'contentWidth': $('#widget-' + widget.shell.id).width(),
						};

						sizes[window.Dashboard.idMap[widget.shell.id].name] = size;
						window.localStorage.setItem(sizeKey, JSON.stringify(sizes));
					} else {
						Dashboard.Utils.emit('options|unsaved-resize|' + widget.name);
					}
				}
			});
		}

		this.refresh();
	},

	reset: function(singleSection) {
		Dashboard.Utils.emit('dashboard|reset');

		window.location.hash = 'section=' + Dashboard.section;

		var sizeKey = '',
			sortKey = '';

		if(singleSection) {
			sizeKey = `${Dashboard.settings.appName}:${Dashboard.section}:sizes`;
			sortKey = `${Dashboard.settings.appName}:${Dashboard.section}:sort-order`;

			if (window.localStorage.getItem(sizeKey) != null) {
				window.localStorage.removeItem(sizeKey);
			}

			if (window.localStorage.getItem(sortKey) != null) {
				window.localStorage.removeItem(sortKey);
			}
		} else {
			//reset all sections
			_.each(Object.keys(this.sectionMap), function(section) {
				sizeKey = `${Dashboard.settings.appName}:${section}:sizes`;
				sortKey = `${Dashboard.settings.appName}:${section}:sort-order`;

				if (window.localStorage.getItem(sizeKey) != null) {
					window.localStorage.removeItem(sizeKey);
				}

				if (window.localStorage.getItem(sortKey) != null) {
					window.localStorage.removeItem(sortKey);
				}
			})
		}

		location.reload();
	},

	showSection: function(section, widgets) {
		Dashboard.Utils.emit('section|' + section);

		// reset screen, load widgets
		Dashboard.clear();
		Dashboard.section = section;

		const sortedWidgets = widgets.slice();

		if (this.settings.drag && this.settings.storage && storageAvailable) {
			const sortKey = `${Dashboard.settings.appName}:${Dashboard.section}:sort-order`;

			if (window.localStorage[sortKey] != null) {
				const sortOrder = JSON.parse(window.localStorage[sortKey]);
				sortedWidgets.sort(({widgetId: id1}, {widgetId: id2}) => {
					const ix1 = sortOrder.indexOf(id1),
					 ix2 = sortOrder.indexOf(id2);

					if (ix1 === ix2) {
						return 0;

						// one of the two not found -- sort that one after;
					} else if (ix1 === -1 || ix2 === -1) {
						return ix1 < ix2 ? 1 : -1;

						// otherwise sort the one that appears first in the sort order first
					} else {
						return ix1 < ix2 ? -1 : 1;
					}
				});
			}

			window.localStorage[sortKey] = JSON.stringify(
				sortedWidgets.map(({widgetId}) => widgetId)
			);
		}

		// show registered section widgets
		sortedWidgets.forEach(obj => {
			Dashboard.show(Object.assign({}, obj,  {section }));
		});


		// show un-registered section widgets
		_.each(
			_.filter(Dashboard.loaded, function(widget) { return widget.section === section }),
			function(val) {
				Dashboard.show({ widgetId: val.name, section: section });
			});
	},

	show: function(opts) {
		const { widgetId } = opts;

		if (!(widgetId in this.widgetDefns)) {
			this.registerWidget(widgetId)
		}

		if (!opts.section) {
			opts.section = '';
		}

		if (this.loaded[widgetId]) {
			var $shell = $('#widget-shell-' + this.loaded[widgetId].shell.id);
			// been loaded, execute?
			if ($shell.css('display') === 'none') {
				// Remove .panel-close
				$shell.children().removeClass('panel-close');

				$shell.css({
					'display': 'block'
				});
			}

			if ( (opts.data) && this.loaded[widgetId].setData ) {
				this.loaded[widgetId].setData(opts.data);

				if (opts.refetch) {
					this.loaded[widgetId].fetch();
				}
			}

			this.refresh();
		} else {
			if (opts.data) {
				this.initData[widgetId] = opts.data;
			}

			// if queued to load, exit here
			if ( this.queued.indexOf(widgetId) >= 0) {
				return;
			}

			// mark as being queued
			this.queued.push(widgetId);

			if (!Dashboard.sectionMap[opts.section]) {
				Dashboard.sectionMap[opts.section] = [];
			}

			Dashboard.sectionMap[opts.section].push(widgetId);

			// drop placement stub
			Dashboard.render.stub(widgetId);
			this.widgetDefns[widgetId](widgetId);
		}
	},

	hide: function(widget) {
		if ($('#widget-shell-' + widget.shell.id).css('display') !== 'none') {
			$('#widget-shell-' + widget.shell.id).css({
				'display': 'none'
			});
		}
	},

	// clear the grounds of any displayed widgets
	// TODO: using show/hide CSS fuckery. Could be easier in the long run to
	// remove from DOM
	clear: function(currentSection) {
		var _this = this;

		_.each(this.loaded, function(val, key) {
			if (currentSection != val.section) {
				_this.hide(val);
			}
		});
	},

	widgetControls: function() {
		$(document).on('click', function(e) {
			var el = $(e.target);

			if ( el.parent().parent().hasClass('panel-action') ) {

				// Widget collapse / expand handler
				if ( el.hasClass('fa-chevron-down') ) {
					Dashboard.Utils.emit('widget-controls|collapse');

					var $ele = el.parents('.panel-heading');
					var $panel = $ele.parent();
					var $widget = $ele.parent().parent();

					$widget.toggleClass('widget-collapse');
					$widget.children('.ui-resizable-handle').toggle();
					$panel.toggleClass('back-panel-collapse');

					Dashboard.grid.layout();

				// Widget close handler
				} else if ( el.hasClass('fa-close') ) {
					Dashboard.Utils.emit('widget-controls|close');

					var $ele = el.parents('.panel');
					$ele.addClass('panel-close');

					setTimeout(function() {
						$ele.parent().css({ 'display': 'none'});
					}, 210);

				// Widget refresh handler
				} else if ( el.hasClass('fa-rotate-right') ) {
					Dashboard.Utils.emit('widget-controls|refresh');

					var wid = el.parents('.panel').parent().attr('id').replace('widget-shell-', ''),
					 $ele = el.parents('.panel-heading').siblings('.panel-body'),
					 postFetchFunc = function() {
 						$ele.find('.overlay').remove();
 						$ele.css('overflow-y', 'auto');
 					 };

					$ele
						.append('<div class="overlay"><div class="overlay-content"><i class="fa fa-refresh fa-2x fa-spin"></i></div></div>')
						.scrollTop(0)
						.css('overflow-y', 'hidden');


					Dashboard.idMap[wid].postFetch = postFetchFunc;
					(Dashboard.idMap[wid].fetch && Dashboard.idMap[wid].fetch());

					setTimeout(postFetchFunc, 2000);
				} else if ( el.hasClass('fa-link') ) {
					Dashboard.Utils.emit('widget-controls|link');

					var wid = el.parents('.panel').parent().attr('id').replace('widget-shell-', ''),
					 params = {
						section: Dashboard.idMap[wid].section,
						widgetId: Dashboard.idMap[wid].name
					 },
					 link = document.location.protocol + '//' + document.location.host + document.location.pathname + '#';

					if (Dashboard.idMap[wid].data) {
						params.data = JSON.stringify(Dashboard.idMap[wid].data);
					}

					link += $.param(params);

					//note: event handler is assigned by user
					$('#_clipboard').val(link);
					$('#_clipboard_button').click();

				}
			}
		});
	},

	removeWidget: function(widgetId) {

		// Make sure the widgetId exists
		if(!(this.loaded[widgetId])) {
			return;
		}

		var shellId = this.loaded[widgetId].shell.id;
		const shell = document.getElementById('widget-shell-' + shellId);

		this.grid.remove(shell);
		Dashboard.refresh();
	}
}

// INIT
$(function() {
	Dashboard.widgetControls();

	Dashboard.Utils.emit('options|resize|' + Dashboard.settings.resize);
	Dashboard.Utils.emit('options|drag|' + Dashboard.settings.drag);
	Dashboard.Utils.emit('options|storage|' + Dashboard.settings.storage);

	// misc hallo
	try {
		console.log(
			' _______ __________________   \n'+
			' \\      \\\\______   \\______ \\  \n'+
			' /   |   \\|     ___/|    |  \\ \n'+
			'/    |    \\    |    |    `   \\ \n'+
			'\\____|__  /____|   /_______  / \n'+
			'        \\/                 \\/ \n' +
			'This app is a product of NPD. \n'+
			'Interested? Ping R556615. Bye! ');
	} catch(e) {}
});

export default Dashboard;
