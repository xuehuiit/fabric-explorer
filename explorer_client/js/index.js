import $ from 'jquery';

import 'bootstrap';
import 'd3';
import 'bootstrap-tour';
import 'jquery-ui';
import 'epoch-charting-ie-patched';
import moment from 'moment';

import 'jif-dashboard/dashboard-core'
import 'jif-dashboard/dashboard-util'
import 'jif-dashboard/dashboard-template'

// import this first because it sets a global all the rest of the widgets need
import './widgets/widget-root';

import common from './common';

import './vendor/stomp.min'
import './vendor/client'
import utils from './utils';
import './tour';

window.utils = utils;
window.moment = moment;


window.Tower = {
	ready: false,
	current: null,
	status: {},

	// Tower Control becomes ready only after the first status is received from the server
	isReady: function() {
		Tower.ready = true;

		// let everyone listening in know
		Dashboard.Utils.emit('tower-control|ready|true');

        if (window.localStorage.getItem('tourEnded') === null) {
            //first time, activate tour automatically
            $(document).trigger('StartTour');
            Tower.tour.start(true);
        }

		return true;
	},


	init: function() {
		//set options for the Dashboard
		Dashboard.setOptions({
			'appName': 'onechain fabricexplorer'
		});

        Dashboard.preregisterWidgets({

            'keyset': require('./widgets/keyset'),
            'chaincodelist': require('./widgets/chaincodelist'),
            'channellist': require('./widgets/channellist'),
            'network': require('./widgets/network'),
            //'metrix_choc_tx'	: require('./widgets/metrix_choc_tx'),
            'metrix_block_min': require('./widgets/metrix_block_min'),
            'metrix_txn_sec': require('./widgets/metrix_txn_sec'),
            'metrix_txn_min': require('./widgets/metrix_txn_min'),
            'peerlist': require('./widgets/peerlist'),
            'blockview': require('./widgets/blockview'),
            'blocklist': require('./widgets/blocklist'),
            'blockinfo': require('./widgets/blockinfo'),
            'txdetail': require('./widgets/txdetail'),

            'chaincodelist4peer': require('./widgets/chaincodelist4peer'),
            'channellist4peer': require('./widgets/channellist4peer'),
        });

		//initialize the Dashboard, set up widget container
		Dashboard.init()

        // Adding event for hash changes
        $(window).on('hashchange', this.processHash);

        this.processHash();

        // Reusing socket from cakeshop.js
        Tower.stomp = Client.stomp;
        Tower.stomp_subscriptions = Client._stomp_subscriptions;

		//open first section - channel
		Tower.section['default']();
	},

    processHash: function() {
        if (window.location.hash) {
            const params = {};
            const hash = window.location.hash.substring(1, window.location.hash.length);

            _.each(hash.split('&'), function(pair) {
                pair = pair.split('=');
                params[pair[0]] = decodeURIComponent(pair[1]);
            });

            var werk = function() {
                if (params.section) {
                    $('#' + params.section).click();
                }

                if (params.data) {
                    try {
                        params.data = JSON.parse(params.data);
                    } catch (err) {}
                }

                if (params.widgetId) {
                    Dashboard.show({
                        widgetId: params.widgetId,
                        section: params.section ? params.section : Tower.current,
                        data: params.data, refetch: true,
                    });
                }
            };

            // do when ready
            if (!Tower.ready) {
                Dashboard.Utils.on(function(ev, action) {
                    if (action.indexOf('tower-control|ready|') === 0) {
                        werk();
                    }
                });
            } else {
                werk();
            }
        }
    },

	//define the sections
	section: {

		'default':function () {

            showSection('org');
            syncStatus(function (response) {
                statusUpdate(response);
            });

            utils.subscribe('/topic/metrics/status', statusUpdate);

		},

        'organization': function () {
            showSection('org');
            // data that the widgets will use
            var data = {
                'numUser': 4,
                'appName': 'sample app',
                'url': 'hello.com',
                'description': 'this is a description of the app.'
            };

            var widgets = [
                {widgetId: 'network', data: data,refetch: true},
            ];

            utils.showHead(["default-channels","default-peers","default-chaincode"]);

            Dashboard.showSection('organization', widgets);
        },

		'channel': function() {
            showSection('channel');
			// data that the widgets will use
			var data = {
				'numUser': 4,
				'appName': 'sample app',
				'url': 'hello.com',
				'description': 'this is a description of the app.'
			}

			var latestBlock;
            syncStatus(function (response) {
                latestBlock=response.latestBlock;
            });

			// the array of widgets that belong to the section,
			// these were preregistered in init() because they are unique

			var widgets = [

				{ widgetId: 'blockinfo',data: {bocknum: latestBlock},refetch: true},
				{ widgetId: 'blocklist' ,data: latestBlock,refetch: true},
				{ widgetId: 'blockview' ,data: data,refetch: true},
				{ widgetId: 'txdetail'  ,data: {txid:'0'},refetch: true},
				{ widgetId: 'peerlist'  ,data: data,refetch: true},
				{ widgetId: 'metrix_txn_sec' ,data: data,refetch: true},
				{ widgetId: 'metrix_txn_min' ,data: data,refetch: true},
				{ widgetId: 'metrix_block_min' ,data: data,refetch: true},
				//{ widgetId: 'metrix_choc_tx' ,data: data},
				{ widgetId: 'chaincodelist' ,data: data,refetch: true},
				{ widgetId: 'keyset' ,data: data,refetch: true},

			];

            //show current channel
            $.when(
                utils.load({ url: 'curChannel' })
            ).done(function(data) {
                var channelName=data.currentChannel;
                $('#showTitle').html($('<span>', {html: channelName}));
            });


            utils.showHead(["default-peers","default-chaincode","default-blocks","default-txn"]);

			// opens the section and pass in the widgets that it needs
			Dashboard.showSection('channel', widgets);
		},

        'peers': function () {
            showSection('peer');
            // data that the widgets will use
            var data = {
                'numUser': 4,
                'appName': 'sample app',
                'url': 'hello.com',
                'description': 'this is a description of the app.'
            }


            var widgets = [
                {widgetId: 'channellist4peer', data: data,refetch: true},
                {widgetId: 'chaincodelist4peer', data: data,refetch: true},
            ];

            //show current peer
            $.when(
                utils.load({ url: 'curPeer' })
            ).done(function(data) {
                var peerName=data.currentPeer;
                $('#showTitle').html($('<span>', {html: peerName}));
            });

            utils.showHead(["default-channels","default-chaincode"]);
            Dashboard.showSection('peers', widgets);
        },

        'api': function() {
            var widgets = [
                { widgetId: 'doc-frame' ,refetch: true}
            ];

            utils.showHead([]);
            Dashboard.showSection('api', widgets);
        }

	},


	debug: function(message) {
		var _ref;
		return typeof window !== 'undefined' && window !== null ? (_ref = window.console) !== null ? _ref.log(message) : void 0 : void 0;
	}
};


var statusUpdate = function(response) {
    var status = response;

    utils.prettyUpdate(Tower.status.peerCount, status.peerCount, $('#default-peers'));
    utils.prettyUpdate(Tower.status.latestBlock, status.latestBlock, $('#default-blocks'));
    utils.prettyUpdate(Tower.status.txCount, status.txCount, $('#default-txn'));
    utils.prettyUpdate(Tower.status.chaincodeCount, status.chaincodeCount, $('#default-chaincode'));
    utils.prettyUpdate(Tower.status.channelCount, status.channelCount, $('#default-channels'));

    Tower.status = status;

    // Tower Control becomes ready only after the first status is received from the server
    if (!Tower.ready) {
        Tower.isReady();
    }

    Dashboard.Utils.emit('node-status|announce');
};

function showSection(sectionName) {

    utils.load({ url: 'showSection' ,data:{'sectionName':sectionName},async:false});
}
function syncStatus(cb) {
    $.ajax({
        type: "post",
        url: "api/status/get",
        cache:false,
        async:false,
        dataType: "json",
        success: function(response){
            cb(response);

        },
        error:function(err){
            statusUpdate({
                peerCount: 'n/a',
                latestBlock: 'n/a',
                txCount: 'n/a',
                chaincodeCount: 'n/a',
                channelCount: 'n/a'
            });
        }

    });
}

$(function() {
	$(window).on('scroll', function(e) {
		if ($(window).scrollTop() > 50) {
			$('body').addClass('sticky');
		} else {
			$('body').removeClass('sticky');
		}
	});


	// logo handler
	$("a.tower-logo").click(function(e) {
		e.preventDefault();
		$("#channel").click();
	});

	// Menu (burger) handler
	$('.tower-toggle-btn').on('click', function() {
		$('.tower-logo-container').toggleClass('tower-nav-min');
		$('.tower-sidebar').toggleClass('tower-nav-min');
		$('.tower-body-wrapper').toggleClass('tower-nav-min');
	});


	$('#reset').on('click', function() {
		Dashboard.reset();
	})


    // Navigation menu handler
    $('.tower-sidebar li').click(function(e) {
        var id = $(this).attr('id');
        if (id === 'help') {
            $(document).trigger('StartTour');
            Tower.tour.start(true);
            return;
        }

        e.preventDefault();

        Tower.current = id;

        $('.tower-sidebar li').removeClass('active');
        $(this).addClass('active');

        Tower.section[Tower.current]();

        $('#showTitle').html($('<span>', {html: $(this).find('.tower-sidebar-item').html()}));
        utils.showSelet(Tower.current);
    });


	// ---------- INIT -----------
	Tower.init();

	// Setting 'peers' as first section
	$('.tower-sidebar li').first().click();
});
