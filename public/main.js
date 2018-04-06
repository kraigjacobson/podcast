window.addEventListener('load', function () {
    const NotFound = { template: '<p>Page not found</p>' }
    const Home = { template: '<p>home page</p>' }
    const About = { template: '<p>about page</p>' }

    const routes = {
        '/': Home,
        '/about': About
    }

    var storage = JSON.parse(localStorage.getItem("user"));
    
    console.log(storage);

    window.readStorage = function () {
        var obj = localStorage.getItem('user');
        return obj;
    }

    window.writeStorage = function (obj) {
        localStorage.setItem("user", JSON.stringify(obj));
    }

    if (!storage) {
        window.writeStorage ({
            "channels": {}
        });
    }

    if (jQuery.isEmptyObject(storage.channels)) {
        // No channels yet. Display Search Page.
    }
    

    var vm = new Vue({
        el: '#app',
        data: {
            currentRoute: window.location.pathname,
            storage: {'channels': {} },
            currentPodcast: {},
            currentEpisode: ''
        },
        methods: {
            getFeed: function (url) {
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

                var local = readStorage();
                
                console.log(2);
                $.ajax('/api/get-podcast/?provider=' + provider + '&id=' + id, {
                    success:function(data) {
                        console.log(3);
                        var x2js = new X2JS();
                        var xmlText = data;
                        var jsonObj = x2js.xml_str2json( xmlText );
                        Vue.set(vm.storage.channels, jsonObj.rss.channel.title, jsonObj.rss.channel);
                        Vue.set(vm.currentPodcast, 'title', jsonObj.rss.channel.title);
                        console.log(jsonObj.rss.channel);
                        console.log(vm.storage);
                    }
                });
            },
            playEpisode: function (episode) {
                vm.currentEpisode = episode;
                console.log(vm.currentEpisode);
                alert(episode);
            }
        },
        created() {
            this.getFeed('https://itunes.apple.com/us/podcast/last-podcast-on-the-left/id437299706?mt=2')
        },
        computed: {
            ViewComponent () {
            return routes[this.currentRoute] || NotFound
            }
        },
        render (h) { return h(this.ViewComponent) }
    })
});
