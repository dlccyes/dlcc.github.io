
// alert('fi0');
    // window.location.href('https://www.google.com');

// location.href = '/pp';
// $(document).ready(function(){
var client_id = '01f12efd21c64c08838af6608650bac1';
var client_secret = 'aec0eb3ae63f40eab5b7834a2cb4703b';
// var redirect_uri = 'https://localhost/spotifyapi';
var redirect_uri = 'https://dlccyes.github.io/';
var scopes = 'user-read-private user-read-email';

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
        }
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
            if (errcallback != undefined)
                errcallback(jqXHR);
        },
    });
}
function spott_get_sync(url, token, callback){ //sync version
    spott_get(url, token, callback, async=false);
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