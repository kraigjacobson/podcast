const express = require('express');
const app = express();
const request = require('request-promise');
const cluster = require('cluster');

if (cluster.isMaster) {
    console.log('Starting master...');
    for (let i=0; i<1; i++) {
        cluster.fork();        
    }


} else {
    console.log('Starting worker ' + cluster.worker.id + '...');
    app.use(express.static('public'));

    app.listen(3000, () => console.log('Example app listening on port 3000!'));

    app.get('/api/get-podcast', async (req, res, next) => {
        let url;
        
        switch(req.query.provider) {
            case 'itunes':
                url = 'https://itunes.apple.com/lookup?id=' + req.query.id + '&entity=podcast';
                console.log(url);
                let response = await request({
                    url: url,
                    method: 'GET'
                });

                url = JSON.parse(response).results[0]['feedUrl'];

                console.log('yep', url);

                break;
            case 'soundcloud':
                console.log('soundcloud');

                // document.querySelector("meta[property='twitter:app:url:ipad']").getAttribute("content");
                break;
            default:
                console.log('Url not supported.');
        }

        console.log('query', req.query);
        let data = await request({
            url: url,
            method: 'GET'
        });
        res.send(data);
    });

    app.get('/*', async (req, res, next) => {
        res.sendFile(__dirname + '/public/index.html');
    });
}