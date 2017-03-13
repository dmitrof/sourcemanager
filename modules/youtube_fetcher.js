/**
 * Created by Дмитрий on 23.11.2016.
 */
//api key is AIzaSyA1faslXR56EAbtZz9LFHsUtZeYXr4SOTw
var YouTube = require('youtube-node');
var youTube = new YouTube();
var request = require('request');
var ACCESS_TOKEN = 'AIzaSyA1faslXR56EAbtZz9LFHsUtZeYXr4SOTw';
youTube.setKey(ACCESS_TOKEN);
//db db must be initialized at this step
/*request.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=ambient&type=video&key=' + ACCESS_TOKEN, function(err, header, body) {
    if (err) throw err
    console.log(body);
});*/

var source_type = "YouTube";
var playListSchema = function(rawItem) {
    item = {};
};

/* TODO когда появится компонент визуализации контента, придется переделать body */
var buildItem = function(rawItem, source_url) {
    item = {};
    item.name = source_type.concat(source_url).concat(rawItem.id.videoId); item.type = 'youtube_video';
    item.title = rawItem.snippet.title;
    item.source_url = source_url;
    item.added_by = 'testUser';
    item.owner = rawItem.snippet.channelId;
    item.metadata = rawItem.snippet;
    item.metadata.etag = rawItem.etag;
    return item;
};

var buildResponse = function(items) {
    if (items.length > 0)
        return { status : "items_fetched",  items : items}
    else return { status : "no_items_fetched"}
};

/*убрать из module.exports*/
/*TODO может быть несколько разных представлений адреса канала*/
var buildRequest = function(source_url) {
    if (source_url.includes('channel')) {
        let channelId = source_url.substring(source_url.indexOf('channel') + 'channel'.length + 1, source_url.length);
        if (channelId.includes('/')) channelId = channelId.substr(0, channelId.indexOf('/'));
        console.log('YouTube channel id: '.concat(channelId));
        let req = 'https://www.googleapis.com/youtube/v3/search?key=access_token&channelId=ch_id&part=snippet,id&order=date&maxResults=10';
        req = req.replace('access_token', ACCESS_TOKEN); req = req.replace('ch_id', channelId);
        return req;
    }
    /*TODO дописать*/
    else if (source_url.includes('playlist')) {
        let playListId = source_url.substring(source_url.indexOf('channel') + 'channel'.length + 1, source_url.length);
        if (playListId.includes('/')) channelId = playListId.substr(0, channelId.indexOf('/'));
        console.log('Parsing youtube playlist'.concat(source_url));
        let req = 'https://www.googleapis.com/youtube/v3/search?key=access_token&channelId=ch_id&part=snippet,id,contentDetails&order=date&maxResults=10';
        req = req.replace('access_token', ACCESS_TOKEN); req = req.replace('ch_id', playListId);
        return req;
    }
    else throw new Error("Wrong source url");
};
module.exports.buildRequest = buildRequest;


var generateErrorText = function(response_body) {
    //console.log(response_body);
    return "Channel fetch error code ".concat(response_body.error.code).concat(": ").concat(response_body.error.message);
};


/* обработка запроса на парсинг ресурса. Возвращает коллекцию из собранных данных */
var fetchAllItems = function(source_url) {
    return new Promise((resolve, reject) => {
        try {
            var items = [];
            var req = buildRequest(source_url);
            request.get(req, function(err, header, body) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                body = JSON.parse(body);
                if (body.hasOwnProperty("error"))
                    reject(generateErrorText(body));
                var itemList = [];
                var rawItems = body.items;
                //console.log(body);
                for (i in rawItems) {
                    var rawItem = rawItems[i];
                    //console.log(rawItem.id.videoId);
                    var item = buildItem(rawItem);
                    //console.log(item);
                    console.log(item.item_id);
                    items.push(item);
                    //console.log(rawItem);
                }

                resolve(buildResponse(items));
            });
        }
        catch(e) { reject(e); }
    });
};
module.exports.fetchAllItems = fetchAllItems;

/* вспомогательные функции при работе с youtube API */
module.exports.utils = {
    addVideoById : function(id, callback) {
        youTube.getById(id, function(error, result) {
            if (error) {
                console.log(error);
                tr_state = 'video NOT added!';
                callback(error, tr_state);
            }
            else {
                console.log(JSON.stringify(result, null, 2));
                itemProvider.saveDoc(result, 'testdocs', function(err, ok) {
                    if (err) {console.log(err)}
                    console.log(ok);
                });
                tr_state = 'video added!';
                callback(null, result);
            }
        });
    },

    setDB : function(_db) {
        this.db = _db;
    }
};





/*youTube.search('UCKPbiit_j8ycmkutM0wVzdA', 10, function(error, result) {
    if (error) {
        console.log(error);
    }
    else {
        //console.log(JSON.stringify(result, null, 2));
    }
});

youTube.getById('HcwTxRuq-uk', function(error, result) {
    if (error) {
        console.log(error);
    }
    else {
        //console.log(JSON.stringify(result, null, 2));
    }
});

youTube.getPlayListsById('PLDyvV36pndZFWfEQpNixIHVvp191Hb3Gg', function(error, result) {
    if (error) {
        console.log(error);
    }
    else {
        console.log(JSON.stringify(result, null, 2));
    }
});

youTube.getPlayListsItemsById('PLDyvV36pndZFWfEQpNixIHVvp191Hb3Gg', function(error, result) {
    if (error) {
        console.log(error);
    }
    else {
        console.log(JSON.stringify(result, null, 2));
    }
});*/