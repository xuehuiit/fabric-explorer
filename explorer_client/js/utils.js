export default {
    load: function (opts) {
        var config = {
            type: opts.method ? opts.method : 'POST',
            url: opts.url,
            contentType: opts.type ? opts.type : 'application/json',
            cache: false,
            async: opts.async ? opts.async : true,
            timeout: opts.timeout ? opts.timeout : 30000
        };

        if (opts.data) {
            config.data = JSON.stringify(opts.data);
        }

        if (opts.complete) {
            config.complete = opts.complete;
        }

        return $.ajax(config);
    },

    subscribe: Client.subscribe,

    prettyUpdate: function (oldValue, newValue, el) {
        if (oldValue !== newValue) {
            el.css({
                'opacity': 0
            });

            setTimeout(function () {
                el.html($('<span>', {
                    html: newValue
                }));

                el.css({
                    'opacity': 1
                });
            }, 500);
        }
    },
    showHead: function (targets) {
        $("#heads-up > div").hide();
        $("#heads-up > div").removeClass();
        var l = 12 / targets.length
        _.each(targets, function (target) {
            $("#" + target).parent().parent().addClass("col-lg-" + l + " col-xs-6");
            $("#" + target).parent().parent().show();
        })
    },
    showSelet: function (target) {
        $('#showSelect').hide();
        var targets = [
            {name: 'channel', showText: "Channels", url: 'channellist',cb:function (data) {
                $("#showSelectContent").html('');
                _.each(data.channelList, function (item) {
                    $("#showSelectContent").append('<li><a href="#">' + item.channelname + '</a></li>')
                })
            }},
            {name: 'peers', showText: "Peers", url: 'peerselectlist',cb:function (data) {
                $("#showSelectContent").html('');
                _.each(data.peerlist, function (item) {
                    $("#showSelectContent").append('<li><a href="#">' + item.name + '</a></li>')
                })
            }}
        ]
        var selected = _.where(targets, {name: target});

        var clkFunc=function (e) {
            e.preventDefault();
            var channelName=$(e.target).html();
            $('#showTitle').html($('<span>', {html: channelName}));

            $.when(
                utils.load({ url: 'changeChannel' ,data: { 'channelName':channelName  }})
            ).done(function(data) {
                Tower.section[Tower.current]();
            });
        };

        $('#showSelectContent').off('click','li a',clkFunc);
        $('#showSelectContent').on('click', 'li a',clkFunc);

        _.each(selected, function (ele) {
            $("#showSelectTitle").html('Select ' + ele.name + '<b class="caret"></b>');


            $.when(
                utils.load({url: ele.url})
            ).done(function (data) {
                ele.cb(data);
            });

            $('#showSelect').show();
        });

    }
};

