var Utils = {
	debug: function(message) {
		var _ref;
		return typeof window !== 'undefined' && window !== null ? (_ref = window.console) != null ? _ref.log(message) : void 0 : void 0;
	},

	demoFuzz: function() {
		return window.demo ? Math.ceil(Math.random() * 10) : 0;
	},

	emit: function(e, quiet) {
		if(!quiet) {
			this.debug('Emitting ' + e);
		}

		if (e) {
			$(document).trigger('WidgetInternalEvent', [ e ]);
		}
	},

	on: function(callback) {
		$(document).on('WidgetInternalEvent', callback);
	},

	copyToClipboard: function(e) {

		if (navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/)) ) {
			//internet explorer
			window.clipboardData.setData('Text', $('#_clipboard').val());
		} else {
			var t = e.target,
			c = t.dataset.copytarget,
			inp = (c ? document.querySelector(c) : null);

			// is element selectable?
			if (inp && inp.select) {
				// select text
				inp.select();

				try {
					// copy text
					document.execCommand('copy');
					inp.blur();
				} catch (err) {
					console.log('did not copy');
					window.prompt("Copy to clipboard: Ctrl+C, Enter", $('#_clipboard').val());
				}
			}
		}
	},

	selectorEscape: function(id) {
		return id.replace( /(:|\.|\[|\]|,|=|@)/g, '\\$1' );
	}
}

window.Dashboard.Utils = Utils;

// Adding event for sleep / wake
$(document).on('visibilitychange', function(e) {
	Dashboard.Utils.emit('tower-control|sleep|' + document.hidden);
});
