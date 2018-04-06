window.addEventListener('load', function () {

    var vm = new Vue({
        el: '#app',
        data: {
            items: []
        },
        methods: {
            getFeed: function (url, podcast) {
                console.log(1);
        
                var provider;
                var id;
        
                if (url.indexOf('itunes' !== -1)) {
                    var match = url.match(/id(\d+)/)
                    if (match) id = match[1];
                    else id = url.match(/\d+/); // 123456
                    provider = 'itunes';
                } else if (url.indexOf('soundcloud' !== -1)) {
                    console.log('url is soundcloud url');
                    provider = 'soundcloud';
                }
                
                console.log(2);
                $.ajax('/get-podcast/?provider=' + provider + '&id=' + id, {
                    success:function(data) {
                        console.log(3);
                        var x2js = new X2JS();
                        var xmlText = data;
                        var jsonObj = x2js.xml_str2json( xmlText );
                        console.log('channel', jsonObj.rss.channel);
                        vm.items = jsonObj.rss.channel.item;
                    }
                });
            }
        },
        created() {
            this.getFeed('https://itunes.apple.com/us/podcast/last-podcast-on-the-left/id437299706?mt=2', 'LastPodcast')
        }
    });


    
      
})
