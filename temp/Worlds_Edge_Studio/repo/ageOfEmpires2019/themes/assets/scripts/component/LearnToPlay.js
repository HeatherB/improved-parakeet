import StringIdGenerator from '../util/StringIdGenerator';
import LTPButtonAnimation from './LTPButtonAnimation';

export default class LearnToPlay {
  constructor() {
    this.init();
  }
  init() {

    let self = this;

    window.addEventListener('load', function() {
      let ltp = document.getElementById('learn-to-play');
      if(ltp) { 
        self.learnWithMap();
        self.learnWithVideo();
      }
    });

  }

  learnWithVideo() {

    function loadVideoPoint() {
      let thisVideo = event.target.closest('.js-mapVideo').querySelector('.js-ltp-video');
      let thisYoutubeVideo = event.target.closest('.js-mapVideo').querySelector('.js-ltp-video-youtube');
      let thisTiming = event.target.closest('li').getAttribute('data-timestamp');
      
      let breakStamp = event.target.closest('li').dataset.timestamp.split(":");
      let hourSlot = breakStamp[0];
      let minuteSlot = breakStamp[1];
      let secondSlot = breakStamp[2];

      let hoursToMins = hourSlot * 60;
      let totalMins = hoursToMins + minuteSlot;
      let minsToSecs = totalMins * 60;
      let totalSeconds = minsToSecs + secondSlot;

      if(thisYoutubeVideo) {
        let youtube_id = thisYoutubeVideo.dataset.youtubeid;
        thisYoutubeVideo.src = 'https://www.youtube.com/embed/' + youtube_id + '?modestbranding=1&rel=0&autoplay=1&start=' + parseInt(totalSeconds, 10);
      } else {
        thisVideo.currentTime = totalSeconds;
      }
      
    }

    function toggleVOpen() {
      event.target.parentNode.classList.toggle('open');
    }

    function makeVidAnchors(video) { 
      let thisVideo = video;
      let videoWrapper;
      if(thisVideo.classList.contains('js-ltp-video-youtube')) {
        videoWrapper = thisVideo.closest('.js-mapYoutubeWrapper');
      } else {
        videoWrapper = thisVideo.closest('.js-mapVideoWrapper');
      }
      let makeVAnchorsFrom = videoWrapper.parentNode.querySelectorAll('.js-alpha-video-list .ltp-heading');
      let anchorList = videoWrapper.parentNode.querySelector('.js-alpha_video_quicknav');
      let ids = new StringIdGenerator();
      let vAnchorListMobileLabel = videoWrapper.parentNode.querySelector('.js-active_video_quicknav');

      makeVAnchorsFrom.forEach(function(makeVAnchor) {
        let li = document.createElement('li');
        let span = document.createElement('span');
        let anchor = document.createElement('a');
        let timestamp = makeVAnchor.closest('li').getAttribute('data-timestamp');
        let firstLetter = ids.next();

        span.innerHTML = makeVAnchor.innerHTML;
        anchor.append(span);
        anchor.setAttribute('class','mapTrigger js-mapTrigger');
        li.setAttribute('data-value',firstLetter);
        li.setAttribute('data-timestamp',timestamp);
        anchor.onclick = loadVideoPoint;
        li.append(anchor);
        anchorList.append(li);
      });

      if(makeVAnchorsFrom.length < 2) {
        videoWrapper.parentNode.classList.add('only_one');
      }

      if(makeVAnchorsFrom.length > 1) {
        vAnchorListMobileLabel.innerHTML = anchorList.firstChild.getElementsByTagName('a')[0].innerHTML;
        vAnchorListMobileLabel.onclick = toggleVOpen;
      }
    }

    function createProgress(video,videoDuration) {
      let videoContainer = video.closest('.js-mapVideoWrapper');
      let videoItems = videoContainer.parentNode.querySelectorAll('.js-alpha-video-list li');
      let timeStampList = videoContainer.parentNode.querySelector('.js-alpha-video-stamps');
      timeStampList.innerHTML = '';

      videoItems.forEach(videoItem => {
        let li = document.createElement('li');
        let span = document.createElement('span');
            span.classList.add('js-ltp-time-trigger');
            li.append(span);
            li.dataset.timestamp = videoItem.dataset.timestamp;
            
        let breakStamp = videoItem.dataset.timestamp.split(":");
        let hourSlot = breakStamp[0];
        let minuteSlot = breakStamp[1];
        let secondSlot = breakStamp[2];

        let hoursToMins = hourSlot * 60;
        let totalMins = hoursToMins + minuteSlot;
        let minsToSecs = totalMins * 60;
        let totalSeconds = minsToSecs + secondSlot;

        let leftPos = (totalSeconds / videoDuration) * 100 + '%';
            li.style.left = leftPos;
        timeStampList.append(li);

        video.addEventListener("timeupdate", function(){
            videoContainer.parentNode.querySelector('.js-progressBar').value = Math.round((video.currentTime / videoDuration) * 100);

            if(this.currentTime >= totalSeconds) {

              let currentActives = document.querySelectorAll('.js-mapVideo .active');
              if(currentActives) {
                for(let c = 0; c < currentActives.length; c++) {
                  currentActives[c].classList.remove('active');
                }
              }

              if(!(videoItem.classList.contains('active'))) {
                videoItem.classList.add('active');
              }
            }
        });
      });

      timeStampList.querySelectorAll('li').forEach(videoStamp => {
        if(videoStamp.dataset.videoid == video.dataset.videoid) {
          videoStamp.classList.add('selected');
        } else {
          videoStamp.classList.remove('selected');
        }
      });

      let btnAnimations = new LTPButtonAnimation();
    }

    function buildVideoCanvas(video) {
      let videoContainer = video.closest('.js-mapVideoWrapper');
      let videoDuration = video.duration;
      let canvasPre = videoContainer.querySelector('.js-blurVidPre');
      let contextPre = canvasPre.getContext('2d');
      let canvasPo = videoContainer.querySelector('.js-blurVidPo');
      let contextPo = canvasPo.getContext('2d');

      let containerWidth = videoContainer.offsetWidth;
      let videoOWidth = video.offsetWidth;
      let videoOHeight = video.offsetHeight;
      let videoNWidth = video.videoWidth;
      let videoNHeight = video.videoHeight;

      let vRatio = videoOHeight / videoOWidth;
      let videoPadding = vRatio * .6;
      if(window.outerWidth < 650) {
         videoPadding = vRatio;
      }
      videoContainer.style.paddingBottom = (videoPadding * 100) + '%';

      let canvasWidth = ((containerWidth - videoOWidth) / 2);
      let canvasHeight = videoOHeight;
      let spread = 10;

      canvasPre.width = canvasWidth;
      canvasPre.height = canvasHeight;
      canvasPo.width = canvasWidth;
      canvasPo.height = canvasHeight;

      if(contextPre.filter !== 'none') {
        console.log('2D Context Filter is not supported');
      } else {
        contextPre.filter = 'blur(' + spread + 'px)';
        contextPo.filter = 'blur(' + spread + 'px)';
      }
      createProgress(video,videoDuration);

      function drawScreen() {
        contextPre.drawImage(video, 0, 0, videoOWidth, videoOHeight);
        if(videoNWidth >= 1920) {
          contextPo.drawImage(video, videoNWidth - (canvasWidth * 2.75), 0, canvasWidth * 2.75, videoNHeight, 0, 0, canvasWidth,  canvasHeight);
        } else {
          contextPo.drawImage(video, videoNWidth - (canvasWidth * .6), 0, canvasWidth, videoNHeight, 0, 0, canvasWidth + (canvasWidth * .75), canvasHeight);
        }
      }
      if(window.outerWidth > 650) {
        setInterval(drawScreen, 20);
      }
    }

    function checkLoad(video) {
      if (video && video.readyState === 4) {
          buildVideoCanvas(video);
      } else {
          setTimeout(checkLoad, 100);
      }
    }

    function reVideo(video) {
      let videoContainer = video.closest('.js-mapVideoWrapper');

      let videoOWidth = video.offsetWidth;
      let videoOHeight = video.offsetHeight;
      let vRatio = videoOHeight / videoOWidth;
      let videoPadding = vRatio * .6;
      if(window.outerWidth < 650) {
         videoPadding = vRatio;
      }
      videoContainer.style.paddingBottom = (videoPadding * 100) + '%';
    }

    function firstVLoad() {
      let videos = document.querySelectorAll('.js-ltp-video');
      let videoWrappers = document.querySelectorAll('.js-mapVideoWrapper');
      let youtube_videos = document.querySelectorAll('.js-ltp-video-youtube');
      let windowWidth = window.outerWidth;
      let endWidth = window.outerWidth;
      if(videos) {
        videos.forEach(function(video) {
          checkLoad(video);
          makeVidAnchors(video);
        });
      }
      if(youtube_videos) {
        youtube_videos.forEach(function(youtube_video) {
          makeVidAnchors(youtube_video);
        });
      }

      if(window.outerWidth > 650) {
        videoWrappers.forEach(function(videoWrapper) {
          videoWrapper.classList.remove('mob_view');
        });
      } else {
        videoWrappers.forEach(function(videoWrapper) {
          videoWrapper.classList.add('mob_view');
        });
      }

      var delay = (function(){
          var timer = 0;
          return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
          };
        })();

        $(window).resize(function() {
          delay(function() {

            endWidth = window.outerWidth;
            /* 40em or 650px is css breakpoint for behavior */
            if((windowWidth > 650 && endWidth < 650) || (windowWidth < 650 && endWidth > 650)) {
              if(videos) {
                videos.forEach(function(video) {
                  reVideo(video);
                  if(window.outerWidth > 650) {
                    videoWrappers.forEach(function(videoWrapper) {
                      videoWrapper.classList.remove('mob_view');
                    });
                  } else {
                    videoWrappers.forEach(function(videoWrapper) {
                      videoWrapper.classList.add('mob_view');
                    });
                  }
                });
              }
            }
          }, 400);
          windowWidth = endWidth;
        });
    }

    firstVLoad();
  }

  learnWithMap() {
    firstMLoad();

    let lastActive;
    let counter = 0;
    let pagerIndex = 0;
    let direction = 1;
    let scale = 2;
    let mapX = 0;
    let mapY = 0;
    let lastX = 0;
    let lastY = 0;

    function loadMapPoint() {
      let newActive = event.currentTarget.value;
      let thisMap;
      if(event.currentTarget.tagName.toLowerCase() === 'button') {
        thisMap = event.target.closest('.js-mapWrapper').parentNode;
      } else {
        thisMap = event.target.closest('.js-info-and-controls').parentNode;
        newActive = event.currentTarget.parentNode.dataset.value;
      }
     
      let anchorList = thisMap.parentNode.querySelector('.js-alpha_trigger_quicknav');
      let mapWrapperImg = thisMap.querySelector('img');

      let quickLinks = anchorList.querySelectorAll('li');
      let btns = thisMap.querySelectorAll('.js-mapTrigger');
      let zoomscale = thisMap.classList.contains('js-zoomIn')? true : false;
      let clicked_btn = event.currentTarget.classList.contains('js-mapTrigger')? true : false;
      let map_centered = (thisMap.classList.contains('js-zoomIn') && thisMap.classList.contains('js-centered'))? true : false;
      let mapWrapperImgWidth = mapWrapperImg.offsetWidth;
      let mapWrapperImgHeight = mapWrapperImg.offsetHeight;
      let mapWrapperWidth = thisMap.offsetWidth;
      let mapWrapperHeight = thisMap.offsetHeight;
      let centerX = mapWrapperImgWidth / 2;
      let centerY = mapWrapperImgHeight / 2;
      let mapOverflow = (mapWrapperImgWidth - mapWrapperWidth);
      
      lastX = thisMap.querySelector('button.active').offsetLeft;
      lastY = thisMap.querySelector('button.active').offsetTop;

      var isOffScreen = function() {
        let acceptablyOnScreen = mapWrapperWidth - 50;
        let point_position = (parseInt(thisMap.parentNode.querySelector('.js-mapWrapper button.active').style.left) / 100) * mapWrapperImgWidth;
        if(point_position > acceptablyOnScreen) {
          // adjust map position
          let halfMap = (thisMap.querySelector('.js-mapWrapper').offsetWidth) / 2;
          let moveMap = (point_position - acceptablyOnScreen) + halfMap;
          if(moveMap > (mapWrapperImgWidth - mapWrapperWidth)) {
             moveMap = mapWrapperImgWidth - mapWrapperWidth;
          }
          thisMap.querySelector('.js-mobile_wrapper').style.left = (-1 * moveMap) + 'px';
        } else {
          //reset map position
          thisMap.querySelector('.js-mobile_wrapper').style.left = '0px';
        }
      }

      var updateActives = function() {
        let contentList = thisMap.parentNode.querySelector('.js-alpha-trigger-list');
        let items = contentList.querySelectorAll('li');
        let mapTriggers = thisMap.querySelectorAll('.js-mapTrigger');
        let shownList = thisMap.querySelectorAll('.js-alpha-trigger-list li');
        let showWhich =  event.currentTarget.value || event.currentTarget.parentNode.getAttribute('data-value');
        let anchorListMobileLabel = thisMap.parentNode.querySelector('.js-active_trigger_quicknav');
        
          mapTriggers.forEach(mapTrigger => {
            mapTrigger.classList.remove('active');
            mapTrigger.parentNode.classList.remove('active');
          });

          shownList.forEach(function(shownLi) {
            shownLi.classList.remove('active');
          });

        if(showWhich) {
          thisMap.parentNode.querySelector('.js-alpha-trigger-list li[data-value = ' + showWhich + ']').classList.add('active');
          thisMap.parentNode.querySelector('.js-mapWrapper button[value = ' + showWhich + ']').classList.add('active');
          thisMap.parentNode.querySelector('.js-alpha_trigger_quicknav li[data-value = ' + showWhich + ']').classList.add('active');
          anchorListMobileLabel.innerHTML = thisMap.parentNode.querySelector('.js-alpha_trigger_quicknav li[data-value = ' + showWhich + ']').getElementsByTagName('a')[0].innerHTML;

          mapX = thisMap.parentNode.querySelector('.js-mapWrapper button.active').offsetLeft;
          mapY = thisMap.parentNode.querySelector('.js-mapWrapper button.active').offsetTop;
        } else {
          items[counter].classList.add('active');
          quickLinks[counter].classList.add('active');
          btns[counter].classList.add('active');
          newActive = btns[counter];
          anchorListMobileLabel.innerHTML = quickLinks[counter].getElementsByTagName('a')[0].innerHTML;
        }
      }

      var zoomOutFromCenter = function() {
        mapWrapperImg.animate([
          {transform: `scale(${scale})`},
          {transform: 'scale(1)'},
        ], {
           duration: 1000,
           fill: 'forwards',
           easing: 'ease-in',
        });
      }

      var zoomInFromCenter = function() {
        mapWrapperImg.animate([
          {transform: 'scale(1)'},
          {transform: `scale(${scale})`},
        ], {
           duration: 1000,
           fill: 'forwards',
           easing: 'ease-in',
        });
      }

      var zoomOutFromPoint = function() {
         mapWrapperImg.animate([
          {transform: `scale(${scale})`, top: (centerY - mapY) + 'px', left: (centerX - mapX) + 'px'},
          {transform: 'scale(1)', top: '0px', left: '0px'},
        ], {
           duration: 1000,
           fill: 'forwards',
           easing: 'ease-in',
        });
      }

      var zoomInFromPoint = function() {
        mapWrapperImg.animate([
          {transform: 'scale(1)', top: '0px', left: '0px'},
          {transform: `scale(${scale})`, top: (centerY - mapY) + 'px', left: (centerX - mapX) + 'px'},
        ], {
           duration: 1000,
           fill: 'forwards',
           easing: 'ease-in',
        });
      }

      var panPointToPoint = function() {
        mapWrapperImg.animate([
          {transform: `scale(${scale})`, top: (centerY - lastY) + 'px', left: (centerX - lastX) + 'px'},
          {transform: `scale(${scale})`, top: (centerY - mapY) + 'px', left: (centerX - mapX) + 'px'},
        ], {
           duration: 1000,
           fill: 'forwards',
           easing: 'ease-in',
        });
      }

      var panCenterToPoint = function() {
        mapWrapperImg.animate([
          {transform: `scale(${scale})`, top: '0px', left: '0px'},
          {transform: `scale(${scale})`, top: (centerY - mapY) + 'px', left: (centerX - mapX) + 'px'},
        ], {
           duration: 1000,
           fill: 'forwards',
           easing: 'ease-in',
        });
      }

      if(zoomscale) {
        if(clicked_btn) {
          updateActives();
          if(mapOverflow > 0) {
            isOffScreen();
          }

          if(thisMap.classList.contains('centered','js-centered')) {
              panCenterToPoint();
          } else {
            if(newActive == lastActive) {
              thisMap.classList.remove('zoomIn','js-zoomIn');
              zoomOutFromPoint();
            } else {
              panPointToPoint();
            }
          }
          thisMap.classList.remove('centered','js-centered');
        } else {
          if(map_centered) {
            thisMap.classList.remove('centered','js-centered');
            thisMap.classList.remove('zoomIn','js-zoomIn');

            zoomOutFromCenter();
          } else {
            thisMap.classList.remove('zoomIn','js-zoomIn');

            zoomOutFromPoint();
          }
        }
      } else {
        thisMap.classList.add('zoomIn','js-zoomIn');
        
        if(clicked_btn) {
          updateActives();

          zoomInFromPoint();
        } else {
          thisMap.classList.add('centered','js-centered');
          
          zoomInFromCenter();
        }
      }

      lastActive = newActive;
    }

    function navigate() {
      let btns = document.querySelectorAll('.js-mapWrapper .js-mapTrigger');
      let thisMap = event.target.closest('.js-mapWrapper').parentNode;
      let contentList = thisMap.querySelector('.js-alpha-trigger-list');
      let items = contentList.querySelectorAll('li');
      let amount = items.length;

      for(var p = 0; p < items.length; p++) {
        if(items[p].classList.contains('active')) {
          counter = p;
          pagerIndex  = p;
        }
      }

      if(event.currentTarget.classList.contains('js-btn_prev')) {
        direction = -1;
      } else {
        direction = 1;
      }

      if(typeof pagerIndex === 'undefined') {
        counter = counter + direction;
      } else {
        counter = pagerIndex + direction;
        pagerIndex = undefined;
      }

      if(direction === -1 && counter < 0) {
        counter = amount - 1;
      }
      if(direction === 1 && !items[counter]) {
        counter = 0;
      }

      for(var i = 0; i < items.length; i++) {
        if(counter === i) {
          mapX = btns[i].offsetLeft;
          mapY = btns[i].offsetTop;
        }
      }
      
      loadMapPoint()
    }

    function toggleOpen() {
      event.target.parentNode.classList.toggle('open');
    }

    function makeAnchors(ltpMap) { 
      let thisMap = ltpMap; 
      let makeAnchorsFrom = thisMap.parentNode.querySelectorAll('.js-info-and-controls .ltp-heading');
      let mobileContainer = thisMap.parentNode.querySelector('.js-mobile_wrapper');
      let anchorList = thisMap.parentNode.querySelector('.js-alpha_trigger_quicknav');
      let anchorListMobileLabel = thisMap.parentNode.querySelector('.js-active_trigger_quicknav');
      let contentList = thisMap.parentNode.querySelector('.js-alpha-trigger-list');
      let ids = new StringIdGenerator();

      if(makeAnchorsFrom.length < 2) {
        thisMap.parentNode.querySelector('.zoom-controls').classList.add('only_one');
        thisMap.parentNode.classList.add('only_one');
      }

      makeAnchorsFrom.forEach(function(makeAnchor) {
        let li = document.createElement('li');
        let span = document.createElement('span');
        let anchor = document.createElement('a');
        let button = document.createElement('button');
        let btnSpan = document.createElement('span');
        let div = document.createElement('div');
        let firstLetter = ids.next();
        let xcoord = makeAnchor.getAttribute('data-x');
        let ycoord = makeAnchor.getAttribute('data-y');
        let winWidth = window.outerWidth;

        button.style.left = xcoord +'%';
        makeAnchor.parentNode.setAttribute('data-value',firstLetter);
        span.innerHTML = makeAnchor.innerHTML;
        anchor.append(span);
        anchor.setAttribute('class','js-mapTrigger');
        li.setAttribute('data-value',firstLetter);
        anchor.onclick = loadMapPoint;
        li.append(anchor);
        anchorList.append(li);
        
        button.setAttribute('type','button');
        button.style.position = 'absolute';
        button.style.top = ycoord +'%';
        btnSpan.innerHTML = firstLetter;
        button.value = firstLetter;
        button.setAttribute('class','js-mapTrigger');
        button.onclick = loadMapPoint;
        button.append(btnSpan);
        div.classList.add('anim-map-point');
        button.append(div);
        mobileContainer.append(button);
      });

      anchorList.firstChild.classList.add('active');
      contentList.getElementsByTagName('li')[0].classList.add('active');
      thisMap.getElementsByTagName('button')[0].classList.add('active');

      if(makeAnchorsFrom.length > 1) {
        anchorListMobileLabel.innerHTML = anchorList.firstChild.getElementsByTagName('a')[0].innerHTML;
        anchorListMobileLabel.onclick = toggleOpen;
      }
    }

    function scrollToNextSection() {
      let thisSection = event.currentTarget.closest('.js-ltp-section');
      let nextSection = thisSection.nextElementSibling;
      let thisScrollBar = thisSection.querySelector('.js-section_scroller');
      let scrollToTop = window.pageYOffset || nextSection.scrollTop;
      if(nextSection) {
        let boundingClientRect = nextSection.getBoundingClientRect();
        window.scroll({top: (scrollToTop + boundingClientRect.top) - 100});
      } else {
        window.scroll({top: (scrollToTop + event.currentTarget.parentNode.offsetHeight) - 100});
      }
    }

    function scrollToPrevSection() {
      let thisSection = event.currentTarget.closest('.js-ltp-section');
      let previousSection = thisSection.previousElementSibling;
      let thisScrollBar = thisSection.querySelector('.js-section_scroller');

      let boundingClientRect = previousSection.getBoundingClientRect();
      let scrollToTop = window.pageYOffset || previousSection.scrollTop;
      window.scroll({top: (scrollToTop + boundingClientRect.top) - 100});
    }

    function reMap() {
      /* reset map and points */
      let mobileMapWrappers = document.querySelectorAll('.js-mobile_wrapper');
      mobileMapWrappers.forEach(mobileMapWrapper => {
        let thisMap = mobileMapWrapper.closest('.js-mapWrapper');
        let mapWrapperWidth = thisMap.offsetWidth;
        let acceptablyOnScreen = mapWrapperWidth - 50;
        let mapWrapperImg = thisMap.querySelector('img');
        let mapWrapperImgWidth = mapWrapperImg.offsetWidth;
        let point_position = (parseInt(thisMap.querySelector('button.active').style.left) / 100) * mapWrapperImgWidth;
        if(point_position > acceptablyOnScreen) {
          // adjust map position
          let halfMap = (thisMap.offsetWidth) / 2;
          let moveMap = (point_position - acceptablyOnScreen) + halfMap;
          if(moveMap > (mapWrapperImgWidth - mapWrapperWidth)) {
             moveMap = mapWrapperImgWidth - mapWrapperWidth;
          }
          thisMap.querySelector('.js-mobile_wrapper').style.left = (-1 * moveMap) + 'px';
        } else {
          thisMap.querySelector('.js-mobile_wrapper').style.left = '0px';
        }
      });
    }

    function activateEventListeners() {
      let nextBTNs = document.querySelectorAll('.js-btn_next');
      let prevBTNs = document.querySelectorAll('.js-btn_prev');
      let zoomBTNs = document.querySelectorAll('.js-btn_zoom');
      let scrollDownBTNS = document.querySelectorAll('.js-to_next_section');
      let scrollUpBTNS = document.querySelectorAll('.js-to_prev_section');
      let windowWidth = window.outerWidth;
      let endWidth = window.outerWidth;

      nextBTNs.forEach(nextBTN => {
        nextBTN.addEventListener('click', navigate);
      });
      prevBTNs.forEach(prevBTN => {
        prevBTN.addEventListener('click', navigate);
      });
      zoomBTNs.forEach(zoomBTN => {
        zoomBTN.addEventListener('click', loadMapPoint);
      });
      scrollDownBTNS.forEach(scrollDBTN => {
        scrollDBTN.addEventListener('click', scrollToNextSection);
      });
      scrollUpBTNS.forEach(scrollUBTN => {
        scrollUBTN.addEventListener('click', scrollToPrevSection);
      });

      var delay = (function(){
          var timer = 0;
          return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
          };
        })();

        $(window).resize(function() {
          delay(function() {

            endWidth = window.outerWidth;
             /*40em or 650px is css breakpoint for behavior */
            if((windowWidth > 650 && endWidth < 650) || (windowWidth < 650 && endWidth > 650)) {
              reMap();
            }
          }, 400);
          windowWidth = endWidth;
        });

    }

    function firstMLoad() {
      let ltpMaps = document.querySelectorAll('.js-mapWrapper');
      if(ltpMaps) {
        ltpMaps.forEach(function(ltpMap) {
          makeAnchors(ltpMap);
        });
        let btnAnimations = new LTPButtonAnimation();
        btnAnimations.firstBuild();
      }

      activateEventListeners();
    }
  
  }
  
}