/**
 * Created by Дмитрий on 13.03.2017.
 */
var youtube_fetcher = require('./../../modules/youtube_fetcher');

//youtube_fetcher.parseDefault("channel", function() {console.log("callback")});

console.log(youtube_fetcher.buildRequest("https://www.youtube.com/channel/UCs7alOMRnxhzfKAJ4JjZ7Wg"));

youtube_fetcher.fetchAllItems("https://www.youtube.com/channel/UCs7alOMRnxhzfKAJ4JjZ7Wg").then(resolve => {
    console.log("ALL ITEMS FETCHED"); console.log(resolve)

},
    reject => {
        console.log(reject);
    }
);
/* попытка спарсить несущесвтующий канал */
youtube_fetcher.fetchAllItems("https://www.youtube.com/channel/NETTAKOGOKANALA").then(resolve => {
        console.log("ALL ITEMS FETCHED"); console.log(resolve)

    },
    reject => {
        console.log(reject);
    }
);

