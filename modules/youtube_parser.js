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
dbHelper = require('./db_wrapper');
db = dbHelper.db;
itemProvider = dbHelper.itemProvider;
module.exports.setDB = function(_db) {
    this.db = _db;
};
/*request.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=ambient&type=video&key=' + ACCESS_TOKEN, function(err, header, body) {
    if (err) throw err
    console.log(body);
});*/
maxResults = 20;
channelId = 'UCKPbiit_j8ycmkutM0wVzdA';
var cv = 'https://www.googleapis.com/youtube/v3/search?key=' + ACCESS_TOKEN;
cv = cv.concat('&channelId=' + channelId +'&part=snippet,id&order=date&maxResults=' + maxResults);

request.get(cv, function(err, header, body) {
    if (err) throw err
    body = JSON.parse(body);
    itemList = body.items;
    //console.log(body);
    for (item in itemList) {
        console.log(itemList[item].id.videoId);
        console.log(itemList[item]);
    }

});




var getChannelId = function(url) {
    return 'UCKPbiit_j8ycmkutM0wVzdA';
};

var getPlayListId = function(url) {
    return 'PLDyvV36pndZFWfEQpNixIHVvp191Hb3Gg';
};

var playListSchema = function(rawItem) {
    item = {};
};

//schema of youtube video item
var videoSchema = function(rawItem, source_url) {
    item = {};
    item.item_id = rawItem.id.videoId; item.type = 'youtube_video';
    item.name = rawItem.snippet.title; item.source = source_url;
    item.added_by = 'testUser'; item.owner = rawItem.snippet.channelId;
    item.body = rawItem.snippet;
    return item;


};

var parseDefault = function(source_url, callback) {
    callback();
    maxResults = 10;
    console.log('youtube_parser is HERE');
    if (source_url.includes('channel')) {
        console.log('parsing channelID');
        channelId = getChannelId(source_url);
        req = 'https://www.googleapis.com/youtube/v3/search?key=access_token&channelId=ch_id&part=snippet,id&order=date&maxResults=10';
        req = req.replace('access_token', ACCESS_TOKEN); req = req.replace('ch_id', channelId);
        console.log(req);
        request.get(req, function(err, header, body) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }
            body = JSON.parse(body);
            var itemList = [];
            var rawItems = body.items;
            //console.log(body);
            for (i in rawItems) {
                var rawItem = rawItems[i];
                //console.log(rawItem.id.videoId);
                var item = videoSchema(rawItem);
                console.log(item.item_id);
                itemProvider.saveDoc(item, 'items', function(err, ok) {
                    if (err) {console.log(err)}
                    console.log(ok);
                });
                //console.log(itemList[item]);
            }


        });
    }

    var cv = 'https://www.googleapis.com/youtube/v3/search?key=' + ACCESS_TOKEN;
    cv = cv.concat('&channelId=' + channelId +'&part=snippet,id&order=date&maxResults=' + maxResults);

};

module.exports.parseDefault = parseDefault;

module.exports.yParser = {
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