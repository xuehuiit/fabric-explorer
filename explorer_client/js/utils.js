export default {
    load: function (opts) {
        var config = {
            type: opts.method ? opts.method : 'POST',
            url: opts.url,
            contentType: opts.type ? opts.type : 'application/json',
            cache: false,
            async: opts.async ? opts.async : true,
            timeout: opts.timeout ? opts.timeout : 300
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
            {name: 'channel', showText: "Channels", url: 'channellist'},
            {name: 'peers', showText: "Peers", url: ''}
        ]
        var selected = _.where(targets, {name: target});

        // $("#showSelectContent").off('click','li a');
        $('#showSelectContent').on('click', 'li a', function (e) {
            e.preventDefault();
            var channelName=$(e.target).html();
            $('#showTitle').html($('<span>', {html: channelName}));

            /*$.ajax({
                type: "post",
                url: '/changeChannel',
                cache:false,
                async:true,
                dataType: "json",
                data: {'channelName':channelName },

                success: function(response){

                    alert("changeChannel"+JSON.stringify(data))

                },
                error:function(err){
                    alert(err)
                }

            });*/

            $.when(
                utils.load({ url: 'changeChannel' ,data: { 'channelName':channelName  }})
            ).done(function(data) {
                // alert("changeChannel"+JSON.stringify(data))
                $.when(
                    utils.load({ url: 'curChannel' })
                ).done(function(data) {
                    // alert("getChannel"+JSON.stringify(data));
                });
            });

            Tower.section[Tower.current]();
        });

        _.each(selected, function (ele) {
            $("#showSelectTitle").html('Select ' + ele.name + '<b class="caret"></b>');


            $.when(
                utils.load({url: ele.url})
            ).done(function (data) {
                $("#showSelectContent").html('');
                _.each(data.channelList, function (item) {
                    $("#showSelectContent").append('<li><a href="#">' + item.channelname + '</a></li>')
                })
            });

            $('#showSelect').show();
        });

    }
};

