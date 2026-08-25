import StringIdGenerator from '../util/StringIdGenerator';
import LTPButtonAnimation from './LTPButtonAnimation';
import ajaxPost from '../util/ajaxPost';
import config from '../config';
import Loading from "./Loading";

export default class LearnToPlay {
  constructor() {
    this._initLoaders();
    this.init();
  }
  init() {

    let self = this;

    /* correct video jumping when point is selected */
    window.addEventListener('load', function() {
      let ltp = document.getElementById('learn-to-play');
      if(ltp) { 
        self.learnByPoints();
      }
    });
  }

  _initLoaders() {
    this.loader = new Loading({
      container: $('body'),
    });
  }

  _alt_post(dataAction,dataString) {
      /*jQuery(document).ready(function($) {
        var data = {
          'action': dataAction,
          'transData': dataString,
        };

        jQuery.post(window.wp_object.ajaxurl, data, function(response) {
          console.log('Got this from the server: ' + response);
        });
      });*/
      var data = {
          'action': dataAction,
          'transData': dataString,
        };
    // setup ajax request
      ajaxPost({
        url: config.api.ajaxurl,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
      }).then((response) => {
        if (response) {
          // valid response
          console.log('success ', response);
        } else {
          // error uploading mod
          console.log('error ', response.errorMessage);
        }
      });
    }

  learnByPoints() {
    let lastActive = '',
        counter = 0,
        pagerIndex = 0,
        direction = 1,
        scale = 2,
        mapX = 0,
        mapY = 0,
        lastX = 0,
        lastY = 0;

    let mapsAndVideos = 0;
    let madeMapsAndVideos = 0;
    let self = this;
    self.loader.show();
    // first launch
    buildLearnToPlay();
    //checkProgress();

   /* function checkProgress() {
      // check if it exists (from php) and build if it doesnt
      // build progress 
      let progressBundle = {}; //jsonObj
      let lessonArray = []; // addressArray
      let lesson = {}; //addresss
      let sectionArray = [];
      let pointsArray = [];
      
      // capture lesson identification
      let trackableLesson = document.getElementById('learn-to-play');
      let trackThisLesson = trackableLesson.dataset.postid;

      lesson.lessonPostID = trackThisLesson;

      // capture map and video sections, they are what is trackable 
      let trackableSections = document.querySelectorAll('.js-progressTrack');
      // capture points from each map or video section 
      trackableSections.forEach(trackableSection => {
        let section = {};
        //let points = {};
        section.heading = trackableSection.querySelector('.lesson_heading').getAttribute('id');
        

        let trackableHeadings = trackableSection.querySelectorAll('.js-pointsWrapper .ltp-heading');
        trackableHeadings.forEach(trackableHeading => {
          let points = {};
          let label = trackableHeading.innerHTML.trim();
          points[label] = false;

          //section.points = trackableHeading.innerHTML.trim();
          //section.points = points;
          //pointsArray.push(points);
          //section.points = pointsArray;
          pointsArray.push(points);
        });
        //pointsArray.push(points);
        section.points = pointsArray;
        sectionArray.push(section);
        //pointsArray.push(points);
        //trackablePoints.push(trackThisSection.innerHTML);
      });
      
      
      lesson.sections = sectionArray;
      //lesson.points = pointsArray;
      lessonArray.push(lesson);
      //progressBundle.section = sectionArray;
      //progressBundle.points = pointsArray;
      progressBundle.lesson = lessonArray;
      console.log('progressBundle ', progressBundle);
      
      //name of lesson (postID from body class): postid-46784 Beginners Guide/Getting Started
      //chapters in lesson (video/map): What is Age, User Interaction, etc.
      //points in chapters: A,B,C, etc.

      //lesson: postid-46784
        //chapters: What Is Age
          //points: A = false, B = false, C = false
        //chapters: User Interaction
          //points: A = false, B = false, C = false

      


       //show progress 
      let chapterProgress = document.querySelector('.chapters ul');
      let progressValue = 0 + '%';
      if(chapterProgress) {
        chapterProgress.style.setProperty("--dynamic-length", progressValue);
      }
      
    }*/

    /* other ajax */
    /*
    $.ajax({
      type: "POST",
      dataType: 'JSON',
      async: false,
      data: {
        action: "getFlightVideos",
        termID: termID,
      },
      url: window.wp_object.ajaxurl,
      success: function (response) {
        $.each(response,function(index,video){
          self.videos[index] = video;
          self.ui.triggerContainer.innerHTML += '<button type="button" data-contenttag="' + index + '" class="flight-media-trigger"><span>' + video.video_name + '</span></button>';
        });
      },
    });
    */
    /* end other ajax */




    function backalt_post(dataAction,dataString) {
      /*jQuery(document).ready(function($) {
        var data = {
          'action': dataAction,
          'transData': dataString,
        };

        jQuery.post(window.wp_object.ajaxurl, data, function(response) {
          console.log('Got this from the server: ' + response);
        });
      });*/
      var data = {
          'action': dataAction,
          'transData': dataString,
        };
    // setup ajax request
      ajaxPost({
        url: config.api.ajaxurl,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
      }).then((response) => {
        if (response) {
          // valid response
          console.log('success ', response);
        } else {
          // error uploading mod
          console.log('error ', response.errorMessage);
        }
      });
    }


    function alertProgress(progressSection,progressPoint) {
      let totalPoints = document.querySelectorAll('.js-progressTrack .js-pointsWrapper li');
      let totalCompleted = document.querySelectorAll('.js-progressTrack li[data-completed = "1"]');
      //let trackableSections = document.querySelectorAll('.js-progressTrack');
      
      /* individual chapter progress */
      let chapterProgress = document.querySelector('.chapters li[data-section = "' + progressSection + '"]');
      let totalSection = document.getElementById(progressSection).closest('.js-progressTrack').querySelectorAll('.js-pointsWrapper li');
      let sectionCompleted = document.getElementById(progressSection).closest('.js-progressTrack').querySelectorAll('.js-pointsWrapper li[data-completed = "1"]');
      let progressValue = Math.trunc(sectionCompleted.length / totalSection.length * 100);
      progressValue = Math.round(progressValue / 10) * 10;
      chapterProgress.dataset.sectionComplete = progressValue;
      
      /* total page progress */
      let totalCompletion = totalCompleted.length / totalPoints.length * 100;
      document.querySelector('.lesson_progress .progress_circle').dataset.length = totalCompletion;

      self._alt_post('update_ltp_progress', JSON.stringify(progressPoint));
      

    }

    function loadMapPoint() {
      let newActive = event.currentTarget.value;
      let thisMap;

      if(event.currentTarget.tagName.toLowerCase() === 'button') {
        thisMap = event.target.closest('.js-mapWrapper').parentNode;
      } else {
        thisMap = event.target.closest('.js-infoAndControls').parentNode;
        newActive = event.currentTarget.parentNode.dataset.value;
      }
       
      let anchorList = thisMap.parentNode.querySelector('.js-alphaQuicknav');
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
          thisMap.querySelector('.js-mobileWrapper').style.left = (-1 * moveMap) + 'px';
        } else {
          //reset map position
          thisMap.querySelector('.js-mobileWrapper').style.left = '0px';
        }
      }

      var updateActives = function() {
        let contentList = thisMap.parentNode.querySelector('.js-pointsWrapper');
        let items = contentList.querySelectorAll('li');
        let mapTriggers = thisMap.querySelectorAll('.js-mapTrigger');
        let shownList = thisMap.querySelectorAll('.js-pointsWrapper li');
        let showWhich =  event.currentTarget.value || event.currentTarget.parentNode.getAttribute('data-value');
        let anchorListMobileLabel = thisMap.parentNode.querySelector('.js-activeQuicknav');
        let progressPoint = '';
        let progressSection = thisMap.parentNode.parentNode.querySelector('.lesson_heading').getAttribute('id');

        mapTriggers.forEach(mapTrigger => {
          mapTrigger.classList.remove('active');
          mapTrigger.parentNode.classList.remove('active');
        });

        shownList.forEach(function(shownLi) {
          shownLi.classList.remove('active');
        });

        if(showWhich) {
          thisMap.parentNode.querySelector('.js-pointsWrapper li[data-value = ' + showWhich + ']').classList.add('active');
          thisMap.parentNode.querySelector('.js-mapWrapper button[value = ' + showWhich + ']').classList.add('active');
          thisMap.parentNode.querySelector('.js-alphaQuicknav li[data-value = ' + showWhich + ']').classList.add('active');
          anchorListMobileLabel.innerHTML = thisMap.parentNode.querySelector('.js-alphaQuicknav li[data-value = ' + showWhich + ']').getElementsByTagName('a')[0].innerHTML;

          mapX = thisMap.parentNode.querySelector('.js-mapWrapper button.active').offsetLeft;
          mapY = thisMap.parentNode.querySelector('.js-mapWrapper button.active').offsetTop;
          progressPoint = thisMap.parentNode.querySelector('.js-pointsWrapper li[data-value = ' + showWhich + '] .ltp-heading').innerHTML.trim();
          thisMap.parentNode.querySelector('.js-pointsWrapper li[data-value = ' + showWhich + ']').dataset.completed = 1;
        } else {
          items[counter].classList.add('active');
          quickLinks[counter].classList.add('active');
          btns[counter].classList.add('active');
          newActive = btns[counter];
          anchorListMobileLabel.innerHTML = quickLinks[counter].getElementsByTagName('a')[0].innerHTML;
          progressPoint = items[counter].querySelector('ltp-heading').innerHTML.trim();
          items[counter].dataset.completed = 1;
        }
        alertProgress(progressSection,progressPoint);
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

    function loadVideoPoint() {
      let thisVideo = event.target.closest('.js-mapVideo').querySelector('.js-ltpVideo');
      let thisTiming = event.target.closest('li').getAttribute('data-timestamp');
      
      let breakStamp = event.target.closest('li').dataset.timestamp.split(":");
      let hourSlot = breakStamp[0];
      let minuteSlot = breakStamp[1];
      let secondSlot = breakStamp[2];

      let hoursToMins = hourSlot * 60;
      let totalMins = hoursToMins + minuteSlot;
      let minsToSecs = totalMins * 60;
      let totalSeconds = minsToSecs + secondSlot;

      thisVideo.currentTime = totalSeconds;
    }

    function toggleOpen() {
      event.target.parentNode.classList.toggle('open');
    }

    function navigate() {
      let btns = document.querySelectorAll('.js-mapWrapper .js-mapTrigger');
      let thisMap = event.target.closest('.js-mapWrapper').parentNode;
      let contentList = thisMap.querySelector('.js-pointsWrapper');
      let items = contentList.querySelectorAll('li');
      let amount = items.length;

      for(var p = 0; p < items.length; p++) {
        if(items[p].classList.contains('active')) {
          counter = p;
          pagerIndex  = p;
        }
      }

      if(event.currentTarget.classList.contains('js-btnPrev')) {
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
      
      loadMapPoint();
    }

    function oneMoreMade() {
      madeMapsAndVideos++;
      if(madeMapsAndVideos.length === mapsAndVideos.length) {
        self.loader.hide();
      }
    }

    function makeAnchors(anchorPointsWrapper) {
      let isMap = false;
      let isVideo = false;
      if(anchorPointsWrapper.classList.contains('js-mapWrapper')) {
        isMap = true;
      } else if(anchorPointsWrapper.classList.contains('js-mapVideoWrapper')) {
        isVideo = true;
      }
      let thisWrapper = anchorPointsWrapper;
      let contentList = thisWrapper.parentNode.querySelector('.js-pointsWrapper');
      let makeAnchorsFrom = thisWrapper.parentNode.querySelectorAll('.js-pointsWrapper .ltp-heading');
      let mobileContainer = thisWrapper.parentNode.querySelector('.js-mobileWrapper');
      let anchorList = thisWrapper.parentNode.querySelector('.js-alphaQuicknav');
      let thisVideo = thisWrapper.parentNode.querySelector('.js-ltpVideo');
      let timeStampList = thisWrapper.parentNode.querySelector('.js-timeStamps');
      let activeQuicknav = thisWrapper.parentNode.querySelector('.js-activeQuicknav');
      let ids = new StringIdGenerator();
      if(timeStampList) {
        timeStampList.innerHTML = '';
      }

      makeAnchorsFrom.forEach(function(makeAnchor) {
         /* shared */
        let li = document.createElement('li');
        let span = document.createElement('span');
        let anchor = document.createElement('a');
        let firstLetter = ids.next();

        /* map piece */
        if(isMap) {
          let button = document.createElement('button');
          let btnSpan = document.createElement('span');
          let div = document.createElement('div');
          let xcoord = makeAnchor.getAttribute('data-x');
          let ycoord = makeAnchor.getAttribute('data-y');
          let winWidth = window.outerWidth;
            makeAnchor.parentNode.setAttribute('data-value',firstLetter);
            anchor.setAttribute('class','js-mapTrigger');
            anchor.onclick = loadMapPoint;
            button.style.left = xcoord +'%';
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
        }
        
         /* video piece */
        if(isVideo) {
          let timestamp = makeAnchor.closest('li').getAttribute('data-timestamp');
              anchor.setAttribute('class','mapTrigger js-mapTrigger');
              li.setAttribute('data-timestamp',timestamp);
              anchor.onclick = loadVideoPoint;

          /* timestamp piece */
          let liStamp = document.createElement('li');
          let spanStamp = document.createElement('span');
              spanStamp.classList.add('js-timeTrigger');
              liStamp.append(spanStamp);
              liStamp.setAttribute('data-timestamp',timestamp);
              
          let breakStamp = timestamp.split(":");
          let hourSlot = breakStamp[0];
          let minuteSlot = breakStamp[1];
          let secondSlot = breakStamp[2];

          let hoursToMins = hourSlot * 60;
          let totalMins = hoursToMins + minuteSlot;
          let minsToSecs = totalMins * 60;
          let totalSeconds = minsToSecs + secondSlot;

          let leftPos = (totalSeconds / thisVideo.duration) * 100 + '%';
              liStamp.style.left = leftPos;
              timeStampList.append(liStamp);
          }

        /* shared buildup */
        span.innerHTML = makeAnchor.innerHTML;
        anchor.append(span);
        li.setAttribute('data-value',firstLetter);
        li.append(anchor);
        anchorList.append(li);
      });

      if(isMap) {
        thisWrapper.getElementsByTagName('button')[0].classList.add('active');
        if(makeAnchorsFrom.length < 2) {
          thisWrapper.parentNode.querySelector('.zoom-controls').classList.add('only_one');
          thisWrapper.parentNode.classList.add('only_one');
        }
      }

      if(isVideo) {
        if(makeAnchorsFrom.length < 2) {
          thisWrapper.parentNode.classList.add('only_one');
        }
      }

      if(makeAnchorsFrom.length > 1) {
        activeQuicknav.innerHTML = anchorList.firstChild.getElementsByTagName('a')[0].innerHTML;
        activeQuicknav.onclick = toggleOpen;
      }

      anchorList.firstChild.classList.add('active');
      contentList.getElementsByTagName('li')[0].classList.add('active');
      oneMoreMade();
      //self.loader.hide();
    }

    function buildProgress(ltpVideo,videoDuration) {
      let videoContainer = ltpVideo.closest('.js-mapVideoWrapper');
      let thisVideo = ltpVideo;
      let videoItems = videoContainer.parentNode.querySelectorAll('.js-pointsWrapper li');
      let timeStampList = videoContainer.parentNode.querySelector('.js-timeStamps');

      videoItems.forEach(videoItem => {   
        let breakStamp = videoItem.dataset.timestamp.split(":");
        let hourSlot = breakStamp[0];
        let minuteSlot = breakStamp[1];
        let secondSlot = breakStamp[2];

        let hoursToMins = hourSlot * 60;
        let totalMins = hoursToMins + minuteSlot;
        let minsToSecs = totalMins * 60;
        let totalSeconds = minsToSecs + secondSlot;

        thisVideo.addEventListener("timeupdate", function(){
            videoContainer.parentNode.querySelector('.js-progressBar').value = Math.round((thisVideo.currentTime / videoDuration) * 100);

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
        if(videoStamp.dataset.videoid == thisVideo.dataset.videoid) {
          videoStamp.classList.add('selected');
        } else {
          videoStamp.classList.remove('selected');
        }
      });
    }

    function buildVideoCanvas(ltpVideo) {
      let videoContainer = ltpVideo.closest('.js-mapVideoWrapper');
      let thisVideo = ltpVideo;
      let videoDuration = thisVideo.duration;
      let canvasPre = videoContainer.querySelector('.js-blurVidPre');
      let contextPre = canvasPre.getContext('2d');
      let canvasPo = videoContainer.querySelector('.js-blurVidPo');
      let contextPo = canvasPo.getContext('2d');
      let containerWidth = videoContainer.offsetWidth;
      let videoOWidth = thisVideo.offsetWidth;
      let videoOHeight = thisVideo.offsetHeight;
      let videoNWidth = thisVideo.videoWidth;
      let videoNHeight = thisVideo.videoHeight;
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
      buildProgress(ltpVideo,videoDuration);

      function drawScreen() {
        contextPre.drawImage(thisVideo, 0, 0, videoOWidth, videoOHeight);
        if(videoNWidth >= 1920) {
          contextPo.drawImage(thisVideo, videoNWidth - (canvasWidth * 2.75), 0, canvasWidth * 2.75, videoNHeight, 0, 0, canvasWidth,  canvasHeight);
        } else {
          contextPo.drawImage(thisVideo, videoNWidth - (canvasWidth * .6), 0, canvasWidth, videoNHeight, 0, 0, canvasWidth + (canvasWidth * .75), canvasHeight);
        }
      }
      if(window.outerWidth > 650) {
        setInterval(drawScreen, 20);
      }
    }

    function checkLoad(thisVideo) {
      //let thisVideo = ltpVideo.querySelector('.js-ltpVideo');
      if (thisVideo && thisVideo.readyState === 4) {
          buildVideoCanvas(thisVideo);
      } else {
          setTimeout(checkLoad, 100);
      }
    }

    function scrollToNextSection() {
      let thisSection = event.currentTarget.closest('.js-ltpSection');
      let nextSection = thisSection.nextElementSibling;
      let thisScrollBar = thisSection.querySelector('.js-sectionScroller');
      let scrollToTop = window.pageYOffset || nextSection.scrollTop;
      if(nextSection) {
        let boundingClientRect = nextSection.getBoundingClientRect();
        window.scroll({top: (scrollToTop + boundingClientRect.top) - 100});
      } else {
        window.scroll({top: (scrollToTop + event.currentTarget.parentNode.offsetHeight) - 100});
      }
    }

    function scrollToPrevSection() {
      let thisSection = event.currentTarget.closest('.js-ltpSection');
      let previousSection = thisSection.previousElementSibling;
      let thisScrollBar = thisSection.querySelector('.js-sectionScroller');
      let boundingClientRect = previousSection.getBoundingClientRect();
      let scrollToTop = window.pageYOffset || previousSection.scrollTop;
      window.scroll({top: (scrollToTop + boundingClientRect.top) - 100});
    }

    function reMap() {
      /* reset map and points */
      let mobileMapWrappers = document.querySelectorAll('.js-mobileWrapper');
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
          mobileMapWrapper.style.left = (-1 * moveMap) + 'px';
        } else {
          mobileMapWrapper.style.left = '0px';
        }
      });
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

    function activateEventListeners() {
      let windowWidth = window.outerWidth;
      let endWidth = window.outerWidth;
      let videoWrappers = document.querySelectorAll('.js-mapVideoWrapper');
      let videos = document.querySelectorAll('.js-ltpVideo');
      let nextBTNs = document.querySelectorAll('.js-btnNext');
      let prevBTNs = document.querySelectorAll('.js-btnPrev');
      let zoomBTNs = document.querySelectorAll('.js-btnZoom');
      let scrollDownBTNS = document.querySelectorAll('.js-toNextSection');
      let scrollUpBTNS = document.querySelectorAll('.js-toPrevSection');

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
            reMap();
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


    function buildLearnToPlay() {
      let ltpVideos = document.querySelectorAll('.js-mapVideoWrapper');
      let ltpMaps = document.querySelectorAll('.js-mapWrapper');

      if(ltpMaps) {
        ltpMaps.forEach(function(ltpMap) {
          makeAnchors(ltpMap);
        });
      }

      if(ltpVideos) {
        ltpVideos.forEach(function(ltpVideo) {
          makeAnchors(ltpVideo);
          let thisVideo = ltpVideo.querySelector('.js-ltpVideo');
          checkLoad(thisVideo);
        });
      }

      if(ltpMaps || ltpVideos) {
        let btnAnimations = new LTPButtonAnimation();
        btnAnimations.firstBuild();

        mapsAndVideos = ltpMaps.length + ltpVideos.length;

        activateEventListeners();
      }
    }

  } /* end learn by points */
}