chrome.runtime.onMessage.addListener (
  function(request, sender, sendResponse) {

    if (request.message === "get_inf") {
      var video = document.getElementsByTagName("video")[0];
      if (video) {
        let data = {
          'currentTime': video.currentTime,
          "duration": video.duration,
          "status": video.paused,
          "volume": video.volume,
          "poster": "https://img.youtube.com/vi/<VID>/mqdefault.jpg"
        }
        sendResponse({video: data});  
      } else {
        sendResponse({video: 'not found'});
      }
    }
  
    if (request.message === "pause_video") {
      let video = document.getElementsByTagName("video")[0];
      if (video) {
        video.pause();
        sendResponse({paused: true, tabId: request.tabId});
      }
    }

    if (request.message === "play_video") {
      let video = document.getElementsByTagName("video")[0];
      if (video) {
        video.play();
        sendResponse({paused: false, tabId: request.tabId});
      }
    }

    if (request.message === "toggle_video_state") {
    	var video = document.getElementsByTagName("video")[0];
      if (video) {
      	if (video.paused) {
      		video.play();
      		sendResponse({paused: false, tabId: request.tabId});
      	} else {
      		video.pause();
      		sendResponse({paused: true, tabId: request.tabId});
      	}
      } else {
      	sendResponse({error: 'No video object found4'});
      }
    }
  }
);