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

var source_type = "youtube";
var playListSchema = function(rawItem) {
    item = {};
};

/* TODO когда появится компонент визуализации контента, придется переделать body */
var buildItem = function(rawItem, source_url) {
    item = {};
    item.name = source_type.concat(rawItem.id.videoId); item.type = 'youtube_video';
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
        return { status : "items_fetched",  items : items};
    else return { status : "no_items_fetched"}
};

var fetchChannelId = function(source_url) {
    let req = "https://www.googleapis.com/youtube/v3/channels?key=access_token&forUsername={USER_NAME}&part=id";
    let userId = source_url.substring(source_url.indexOf('user') + 'user'.length + 1, source_url.length);
    if (userId.includes('/')) userId = userId.substr(0, userId.indexOf('/'));
    req = req.replace('access_token', ACCESS_TOKEN);
    req = req.replace('{USER_NAME}', userId);
    console.log(req);
    return new Promise((resolve, reject) => {
        request.get(req, function(err, header, body) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            body = JSON.parse(body);
            if (body.hasOwnProperty("error"))
                reject(generateErrorText(body));
            console.log('channelID is ' + body.items[0].id);
            resolve(body.items[0].id);
        });
    });
};

module.exports.fetchChannelId = fetchChannelId;

/*убрать из module.exports*/
/*TODO может быть несколько разных представлений адреса канала*/
var buildRequest = async function(source_url) {
    return new Promise((resolve, reject) => {
        if (source_url.includes('user')) {
            fetchChannelId(source_url).then(channelId=> {
                let req = 'https://www.googleapis.com/youtube/v3/search?key=access_token&channelId=ch_id&part=snippet,id&order=date&maxResults=10';
                req = req.replace('access_token', ACCESS_TOKEN); req = req.replace('ch_id', channelId);
                resolve(req);
            }, rejected => reject(rejected));

        }
        else if (source_url.includes('channel')) {
            let channelId = source_url.substring(source_url.indexOf('channel') + 'channel'.length + 1, source_url.length);
            if (channelId.includes('/')) channelId = channelId.substr(0, channelId.indexOf('/'));
            console.log('YouTube channel id: '.concat(channelId));
            let req = 'https://www.googleapis.com/youtube/v3/search?key=access_token&channelId=ch_id&part=snippet,id&order=date&maxResults=10';
            req = req.replace('access_token', ACCESS_TOKEN); req = req.replace('ch_id', channelId);
            resolve(req);
        }
        /*TODO дописать*/
        else if (source_url.includes('playlist')) {
            let playListId = source_url.substring(source_url.indexOf('channel') + 'channel'.length + 1, source_url.length);
            if (playListId.includes('/')) channelId = playListId.substr(0, channelId.indexOf('/'));
            console.log('Parsing youtube playlist'.concat(source_url));
            let req = 'https://www.googleapis.com/youtube/v3/search?key=access_token&channelId=ch_id&part=snippet,id,contentDetails&order=date&maxResults=10';
            req = req.replace('access_token', ACCESS_TOKEN); req = req.replace('ch_id', playListId);
            resolve(req);
        }
        else reject("Wrong source url");
    });

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
            buildRequest(source_url).then(req => {
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
                        var item = buildItem(rawItem, source_url);
                        //console.log(item);
                        items.push(item);
                    }
                    console.log(buildResponse(items));
                    resolve(buildResponse(items));
                });
            }, rejected => console.log(rejected));

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