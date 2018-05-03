var matchUrl = '*://www.youtube.com/watch?v*';
var queryInfo = {
    url: matchUrl
};

var _check_tabs = function(tabs, id) {
    tabs.forEach(function(tab) {
        if (tab.id != id) {
            chrome.tabs.sendMessage(tab.id, {
                message: 'pause_video',
                tabId: tab.id
            }, function(response) {});
        }
    });
}


function _secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + "" : "";
    var mDisplay = m > 0 ? m + ", " : "";
    var sDisplay = s > 0 ? s + "" : "";
    return hDisplay + mDisplay + sDisplay;
}

chrome.tabs.query(queryInfo, function(tabs) {


    var list = $('.songs-list');
    var poster = $('.player_poster');
    var poster_wide = $('.player_poster_wide');

    if (tabs.length == 0) {
        var html = `
            <div style="padding: 10px;">No active any youTube video tabs</div>
        `
        poster.hide();
        poster_wide.hide();
        $('.main').html($(html));
    } else {

        tabs.forEach(function(tab) {

            chrome.tabs.sendMessage(tab.id, {
                message: 'get_inf',
                tabId: tab.id
            }, function(response) {

                let video_id = tab.url.split("?v=")[1];
                let poster_url = response.video.poster.replace("<VID>", video_id);
                let duration = _secondsToHms(response.video.duration);
                let video_title = tab.title.substr(0, 32);

                if (!response.video.status) {
                    poster_wide.attr("src", poster_url);
                    poster.attr("src", poster_url);
                    poster.addClass("rotating");
                } else {
                    poster.attr("src", "assets/youtube.png");
                    poster_wide.attr("src", "assets/youtube-music.png");
                }

                let html = `
                    <tr>
                      <td id="playpause${tab.id}" class="play-pause"><img src="${poster_url}"></td>
                      <td id="go${tab.id}">${video_title}</td>
                      <td><font size="2">${duration}</font></td>
                      <td><i id="close${tab.id}" class="fa fa-close"></i></td>
                    </tr>
                `
                list.append($(html));

                $('#playpause' + tab.id).on('click', {
                    tabId: tab.id
                }, function(event) {
                    _check_tabs(tabs, event.data.tabId);
                    chrome.tabs.sendMessage(event.data.tabId, {
                        message: 'toggle_video_state',
                        tabId: event.data.tabId
                    }, function(response) {
                        if (!response.error) {
                            chrome.tabs.sendMessage(tab.id, {
                                message: 'get_inf',
                                tabId: tab.id
                            }, function(response) {
                                let video_id = tab.url.split("?v=")[1];
                                let poster_url = response.video.poster.replace("<VID>", video_id);
                                poster_wide.attr("src", poster_url);
                                poster.attr("src", poster_url);
                            });
                            if (response.paused) {
                                poster.removeClass("rotating")
                            } else {
                                poster.addClass("rotating");
                            }
                        }
                    });
                });

                $('#go' + tab.id).on('click', {
                    tabId: tab.id,
                    windowId: tab.windowId
                }, function(event) {
                    chrome.windows.update(event.data.windowId, {
                        focused: true
                    });
                    chrome.tabs.update(event.data.tabId, {
                        active: true
                    });
                    window.close();
                });

                $('#close' + tab.id).on('click', {
                    tabId: tab.id
                }, function(event) {
                    chrome.tabs.remove(event.data.tabId);
                    window.close();
                });
            });
        });
    }
});