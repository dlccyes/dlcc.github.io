function login(){
    var url='https://accounts.spotify.com/authorize'
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-playback-state playlist-read-private"
    location.href = url;
}
// })

function get_token(){
    var newurl = String(window.location);
    var code = newurl.slice(newurl.search(/=/)+1,);
    var tolkien = null;
    $.ajax({
        method: "POST",
        url: "https://accounts.spotify.com/api/token",
        data: {
          "grant_type":    "authorization_code",
          "code":          code,
          "redirect_uri":  redirect_uri,
          "client_id":     client_id,
          "client_secret": client_secret,
        },
        async: false,
        success: function(result){
            tolkien = result['access_token'];
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error ' + textStatus);
            console.log(jqXHR);
        },
        timeout: 5000
    });
    return tolkien; 
}

function spott_get(url, token, callback, async=true){
    $.ajax({
        async: async,
        url : url,
        dataType : 'json',
        type : 'GET',
        // async: false;
        headers : {
            // 'Acccept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ token,
        },
        success: function(xhr) {
            if(callback){
                callback(xhr);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error ' + textStatus);
            console.log(jqXHR);
        },
        timeout: 5000
    });
}
function spott_get_sync(url, token, callback){ //sync version
    spott_get(url, token, callback, async=false);
}

function get_all_playlists(){
    var continuue = true;
    // if(playlists.length != 0){ //alreadt executed
    //     continuue = false;
    // }
    var next_url = 'https://api.spotify.com/v1/me/playlists?limit=50';
    while(continuue){
        spott_get_sync(next_url, token, function(xhr){
            // console.log(xhr['items']);
            playlists = playlists.concat(xhr['items']);
            // for(var i in xhr['items']){
            //     playlists.push(xhr['items'][i]);
            // }
            if(xhr['next']){
                next_url = xhr['next'];
            }else{
                continuue = false;
            }
        });
    }
}
// function current_playback(token){
//     // var result = null
//     $.ajax({
//         url : 'https://api.spotify.com/v1/me/player',
//         dataType : 'json',
//         type : 'GET',
//         // async: false;
//         headers : {
//             // 'Acccept': 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer '+ token,
//         },
//         success: function(data) {
//             console.log(data);
//             // result = data;
//         }
//     });
//     // return result;
// }

function ArtistDistribution(tracks){
    var artists = {};
    for(var item of tracks){
        // console.log(item);
        for(var artist of item['track']['artists']){
            if(!artists[artist['name']]){
                artists[artist['name']] = 0;
            }
            artists[artist['name']] += 1;
        }
    }
    // console.log(artists);
    // console.log(sortDict(artists));
    return sortDict(artists);
}

function sortDict(ogDict) {
    var keys = keys = Object.keys(ogDict);
    sortedKey = keys.sort(function(a,b){return ogDict[b]-ogDict[a]});
    sortedArr = [];
    for(key of sortedKey){
        sortedArr.push([key, ogDict[key]]);
    }
    return sortedArr;
}