import StringIdGenerator from '../util/StringIdGenerator';
import LTPButtonAnimation from './LTPButtonAnimation';
import ajaxPost from '../util/ajaxPost';
import config from '../config';
import Loading from "./Loading";


export default class LearnToPlay {
  constructor() {
    this.init();
  }
  init() {

    let self = this;

    this.ui = {
      madeMapsAndVideos: 0,
    }

    // loader hidden for dev/local
    //this._initLoaders();

    window.addEventListener('load', function() {
      let ltp = document.getElementById('learn-to-play');
      if(ltp) { 
        self._buildLearnToPlay();
      }
    });
  }

   /*_initLoaders() {
    this.loader = new Loading({
      container: $('body'),
    });
  }*/

  _alt_post(dataAction,dataString) {
      $.ajax({
        type: "POST",
        dataType: 'JSON',
        async: true,
        data: {
          'action': dataAction,
          'transData': dataString,
        },
        url: window.wp_object.ajaxurl,
        success: function (response) {
          console.log('success ', response);
        },
      });
    }

    _alertProgress(progressSection,progressPoint) {
      let self = this;
      let totalPoints = document.querySelectorAll('.js-progressTrack .js-pointsWrapper li.pointsWrapperItem');
      let totalCompleted = document.querySelectorAll('.js-progressTrack li[data-completed = "1"]');
      
      /* individual chapter progress */
      let chapterProgress = document.querySelector('.chapters li[data-section = "' + progressSection + '"]');
      let totalSection = document.getElementById(progressSection).closest('.js-progressTrack').querySelectorAll('.js-pointsWrapper li.pointsWrapperItem');
      let sectionCompleted = document.getElementById(progressSection).closest('.js-progressTrack').querySelectorAll('.js-pointsWrapper li[data-completed = "1"]');
      let progressValue = Math.trunc(sectionCompleted.length / totalSection.length * 100);
      progressValue = Math.round(progressValue / 10) * 10;
      chapterProgress.dataset.sectionComplete = progressValue;
      
      /* total page progress */
      let totalCompletion = totalCompleted.length / totalPoints.length * 100;
      totalCompletion = Math.round(totalCompletion / 10) * 10;
      document.querySelector('.current_lesson .lesson_progress .progress_circle').dataset.length = totalCompletion;

      // capture lesson identification
      let trackableLesson = document.getElementById('learn-to-play').dataset.postid;

      let updateData = {
        'progressPoint': progressPoint,
        'pageID': 'ltp_' + trackableLesson,
        'pageCompletion': totalCompletion,
        'sectionName': chapterProgress.querySelector('span').innerHTML,
        'sectionCompletion': progressValue,
      }

      self._alt_post('update_ltp_progress', JSON.stringify(updateData));
    }

    _loadSlidePoint(counter) {
      let self = this;
      counter = counter ? counter : 0;
      let thisSlideSection = event.target.closest('.js-ltpSection');
      let theseSlides = thisSlideSection.querySelectorAll('.js-alphaQuicknav li');
      //let theseSlidesContent = thisSlideSection.querySelectorAll('.js-pointsWrapper li');
        let contentList = thisSlideSection.querySelector('.js-pointsWrapper');
        let items = contentList.querySelectorAll('li.pointsWrapperItem');
      let showWhich = event.target.closest('li');
      let img = document.createElement('img');
      let slideImages = thisSlideSection.querySelectorAll('.js-slideWrapper .js-mobileWrapper img');
      let progressPoint = '';
      let progressSection = thisSlideSection.querySelector('.lesson_heading').getAttribute('id');
      console.log('progressSection ', progressSection);

      items.forEach(thisSlideContent => {
        thisSlideContent.classList.remove('active');
      });
      theseSlides.forEach(thisSlide => {
        thisSlide.classList.remove('active');
      });
      slideImages.forEach(slideImage => {
        slideImage.classList.remove('active');
      });

      if(showWhich) {
        console.log('showWhich ');
        event.target.closest('li').classList.add('active');
        thisSlideSection.querySelector('.js-pointsWrapper li[data-value = ' + showWhich.dataset.value + ']').classList.add('active');
        thisSlideSection.querySelector('.js-mobileWrapper img[data-value = ' + showWhich.dataset.value + ']').classList.add('active');

        progressPoint = event.target.closest('li').getElementsByTagName('span')[0].innerHTML.trim();
        console.log('progressPoint ', progressPoint);
        thisSlideSection.querySelector('.js-pointsWrapper li[data-value = ' + showWhich.dataset.value + ']').dataset.completed = 1;
      } else {
        console.log('else ')
        items[counter].classList.add('active');
        slideImages[counter].classList.add('active');
        theseSlides[counter].classList.add('active');

        progressPoint = items[counter].querySelector('.ltp-heading').innerHTML.trim();
        console.log('progressPoint ', progressPoint);
        items[counter].dataset.completed = 1;
      }
      self._alertProgress(progressSection,progressPoint);
    }

    _loadMapPoint(mapX,mapY,counter) {
      mapX = mapX ? mapX : 0;
      mapY = mapY ? mapY : 0;
      counter = counter ? counter : 0;
      let newActive = event.currentTarget.value;
      let lastActive = newActive;
      let thisMap;
      let self = this;

      if(event && event.currentTarget.tagName && event.currentTarget.tagName.toLowerCase() === 'button') {
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
      let scale = 2;
      let lastX = thisMap.querySelector('button.active').offsetLeft;
      let lastY = thisMap.querySelector('button.active').offsetTop;

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
        let items = contentList.querySelectorAll('li.pointsWrapperItem');
        let mapTriggers = thisMap.querySelectorAll('.js-mapTrigger');
        let shownList = thisMap.querySelectorAll('.js-pointsWrapper li.pointsWrapperItem');
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
          anchorListMobileLabel.innerHTML = thisMap.parentNode.querySelector('.js-alphaQuicknav li[data-value = ' + showWhich + ']').getElementsByTagName('span')[0].innerHTML;

          mapX = thisMap.parentNode.querySelector('.js-mapWrapper button.active').offsetLeft;
          mapY = thisMap.parentNode.querySelector('.js-mapWrapper button.active').offsetTop;
          progressPoint = thisMap.parentNode.querySelector('.js-pointsWrapper li[data-value = ' + showWhich + '] .ltp-heading').innerHTML.trim();
          thisMap.parentNode.querySelector('.js-pointsWrapper li[data-value = ' + showWhich + ']').dataset.completed = 1;
        } else {
          items[counter].classList.add('active');
          quickLinks[counter].classList.add('active');
          btns[counter].classList.add('active');
          newActive = btns[counter];
          anchorListMobileLabel.innerHTML = quickLinks[counter].getElementsByTagName('span')[0].innerHTML;
          progressPoint = items[counter].querySelector('.ltp-heading').innerHTML.trim();
          items[counter].dataset.completed = 1;
        }
        self._alertProgress(progressSection,progressPoint);
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

    _loadVideoPoint() {
      let self = this;
      let thisVideo = event.target.closest('.js-mapVideo').querySelector('.js-ltpVideo');
      let thisTiming = event.target.closest('li').getAttribute('data-timestamp');
      let thisStamp = event.target.closest('li').dataset.timestamp;
      thisVideo.currentTime = thisStamp;
    }

    _toggleOpen() {
      event.target.parentNode.classList.toggle('open');
    }

    _navigate() {
      let self = this;
      let isSlides = false;
      let isMap = false;
      let items = '';
      let amount = 0;
      let mapX = 0;
      let mapY = 0;
      let btns = '';

      if(event.target.closest('.js-slideWrapper')) {
        isSlides = true;
      } else {
        isMap = true;
      }

      if(isSlides) {
        let thisSlide = event.target.closest('.js-slideWrapper').parentNode;
        let contentList = thisSlide.querySelector('.js-pointsWrapper');
        items = contentList.querySelectorAll('li.pointsWrapperItem');
        amount = items.length;
      }

      if(isMap) {
        let thisMap = event.target.closest('.js-mapWrapper').parentNode;
        let contentList = thisMap.querySelector('.js-pointsWrapper');
        btns = document.querySelectorAll('.js-mapWrapper .js-mapTrigger');
        items = contentList.querySelectorAll('li.pointsWrapperItem');
        amount = items.length;
        mapX = 0;
        mapY = 0;
      }

      let counter = 0;
      let direction = 1;
      let pagerIndex = 0;

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

      if(isSlides) {
         self._loadSlidePoint(counter);
      }

      if(isMap) {
        for(var i = 0; i < items.length; i++) {
          if(counter === i) {
            mapX = btns[i].offsetLeft;
            mapY = btns[i].offsetTop;
          }
        }
        self._loadMapPoint(mapX,mapY,counter);
      }
    }

    _oneMoreMade() {
      let self = this;
      self.ui.madeMapsAndVideos++;
      let ltpVideos = document.querySelectorAll('.js-mapVideoWrapper');
      let ltpMaps = document.querySelectorAll('.js-mapWrapper');
      let mapsAndVideos = ltpMaps.length + ltpVideos.length;
      if(self.ui.madeMapsAndVideos === mapsAndVideos) {
        let btnAnimations = new LTPButtonAnimation();
        btnAnimations.firstBuild();
        //self.loader.hide();
      }
    }

    _makeAnchors(anchorPointsWrapper) {
      let self = this;
      let isMap = false;
      let isVideo = false;
      let isSlide = false;
      if(anchorPointsWrapper.classList.contains('js-mapWrapper')) {
        isMap = true;
      } else if(anchorPointsWrapper.classList.contains('js-mapVideoWrapper')) {
        isVideo = true;
      } else if(anchorPointsWrapper.classList.contains('js-slideWrapper')) {
        isSlide = true;
      }
      let thisWrapper = anchorPointsWrapper;
      let contentList = thisWrapper.parentNode.querySelector('.js-pointsWrapper');
      let makeAnchorsFrom = thisWrapper.parentNode.querySelectorAll('.js-pointsWrapper .ltp-heading');
      let mobileContainer = thisWrapper.parentNode.querySelector('.js-mobileWrapper');
      let slideContainer = thisWrapper.parentNode.querySelector('.js-slideWrapper .js-mobileWrapper');
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

        /* slide piece */
        /* map piece */
        if(isSlide) {
          let img = document.createElement('img');
          img.src = makeAnchor.parentNode.dataset.img;
          makeAnchor.parentNode.setAttribute('data-value',firstLetter);
          anchor.setAttribute('class','js-slideTrigger');
          img.dataset.value = makeAnchor.parentNode.dataset.value;
          slideContainer.append(img);
        }

        /* map piece */
        if(isMap) {
          let button = document.createElement('button');
          let btnSpan = document.createElement('span');
          let xcoord = makeAnchor.getAttribute('data-x');
          let ycoord = makeAnchor.getAttribute('data-y');
          let winWidth = window.outerWidth;
          makeAnchor.parentNode.setAttribute('data-value',firstLetter);
          anchor.setAttribute('class','js-mapTrigger');
          button.style.left = xcoord +'%';
          button.setAttribute('type','button');
          button.style.position = 'absolute';
          button.style.top = ycoord +'%';
          btnSpan.innerHTML = firstLetter;
          button.value = firstLetter;
          button.setAttribute('class','js-mapTrigger');
          button.append(btnSpan);
          mobileContainer.append(button);
        }
        
        /* video piece */
        if(isVideo) {
          let timestamp = makeAnchor.closest('li').getAttribute('data-timestamp');
              anchor.setAttribute('class','js-videoTrigger');

          /* timestamp piece */
          let liStamp = document.createElement('li');
          let spanStamp = document.createElement('span');
              spanStamp.classList.add('js-timeTrigger');
              liStamp.append(spanStamp);
              
          let breakStamp = timestamp.split(":");
          let hourSlot = breakStamp[0];
          let minuteSlot = breakStamp[1];
          let secondSlot = breakStamp[2];

          let hoursToMins = hourSlot * 60;
          let totalMins = hoursToMins + minuteSlot;
          let minsToSecs = totalMins * 60;
          let totalSeconds = minsToSecs + secondSlot;

          let convertedTime = parseInt(totalSeconds, 10);
          li.setAttribute('data-timestamp',convertedTime);
          liStamp.setAttribute('data-timestamp',convertedTime);
          makeAnchor.closest('li').setAttribute('data-timestamp',convertedTime);

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
        activeQuicknav.onclick = self._toggleOpen;
      }

      anchorList.firstChild.classList.add('active');
      contentList.getElementsByTagName('li')[0].classList.add('active');
      if(isSlide) {
        let slideImages = thisWrapper.parentNode.querySelectorAll('.js-slideWrapper .js-mobileWrapper img');
        slideImages[0].classList.add('active');
      }
      self._oneMoreMade();
    }

    _buildProgress(ltpVideo,videoDuration) {
      let self = this;
      let videoContainer = ltpVideo.closest('.js-mapVideoWrapper');
      let thisVideo = ltpVideo;
      let videoItems = videoContainer.parentNode.querySelectorAll('.js-pointsWrapper li.pointsWrapperItem');
      let timeStampList = videoContainer.parentNode.querySelector('.js-timeStamps');
      let progressSection = ltpVideo.closest('.js-ltpSection').querySelector('.lesson_heading').getAttribute('ID');
      let anchorListMobileLabel = videoContainer.parentNode.querySelector('.js-activeQuicknav');

      videoItems.forEach(videoItem => {  
        let thisStamp =  videoItem.dataset.timestamp;
        
        thisVideo.addEventListener("timeupdate", function(){
            videoContainer.parentNode.querySelector('.js-progressBar').value = Math.round((thisVideo.currentTime / videoDuration) * 100);

            if(this.currentTime >= thisStamp) {
              let currentActives = document.querySelectorAll('.js-mapVideo .active');
              if(currentActives) {
                for(let c = 0; c < currentActives.length; c++) {
                  currentActives[c].classList.remove('active');
                }
              }

              if(!(videoItem.classList.contains('active'))) {
                videoItem.classList.add('active');
              }

              if(Math.round(this.currentTime) == thisStamp) {
                let parent = videoContainer.parentNode.querySelector('.js-pointsWrapper');
                let findActive = parent.querySelector('li[data-timestamp = "' + thisStamp + '"]').querySelector('.ltp-heading');
                let activeLabel = findActive.innerHTML.trim();
                anchorListMobileLabel.innerHTML = activeLabel;
                parent.querySelector('li[data-timestamp = "' + thisStamp + '"]').dataset.completed = 1;
                  
                self._alertProgress(progressSection,activeLabel);
              }

            }
        });
      });
    }

    _buildVideoCanvas(ltpVideo) {
      let self = this;
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
      self._buildProgress(ltpVideo,videoDuration);

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

    _checkLoad(thisVideo) {
      let self = this;
      if (thisVideo && thisVideo.readyState === 4) {
          self._buildVideoCanvas(thisVideo);
      } else {
          setTimeout(self._checkLoad, 100);
      }
    }

    _scrollToSection() {     
      event.preventDefault();
      event.stopPropagation();

      let href = event.currentTarget.getAttribute("href");
      let hrefID = document.getElementById(href.substring(1));
      let thisSection = hrefID.closest('.js-ltpSection');
      let scrollToTop = window.pageYOffset || thisSection.scrollTop;
      let scrollAmt = 0;
      if(href == '#learn-to-play') {
        scrollAmt = 0;
      } else {
        let boundingClientRect = thisSection.getBoundingClientRect();
        scrollAmt = (scrollToTop + boundingClientRect.top) - 130;
      }
      $("html, body").animate({ scrollTop: scrollAmt }, 800);
    }

    _scrollToNextSection() {
      let thisSection = event.currentTarget.closest('.js-ltpSection');
      let nextSection = thisSection.nextElementSibling;
      let scrollToTop = window.pageYOffset || nextSection.scrollTop;
      if(nextSection) {
        let boundingClientRect = nextSection.getBoundingClientRect();
        $("html, body").animate({ scrollTop: (scrollToTop + boundingClientRect.top) - 100 }, 800);
      } else {
        $("html, body").animate({ scrollTop: (scrollToTop + event.currentTarget.parentNode.offsetHeight) - 100 }, 800);
      }
    }

    _scrollToPrevSection() {
      let thisSection = event.currentTarget.closest('.js-ltpSection');
      let previousSection = thisSection.previousElementSibling;
      let boundingClientRect = previousSection.getBoundingClientRect();
      let scrollToTop = window.pageYOffset || previousSection.scrollTop;
      $("html, body").animate({ scrollTop:(scrollToTop + boundingClientRect.top) - 100 }, 800);
    }

    _reMap() {
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

    _reVideo(video) {
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

    _activateEventListeners() {
      let self = this;
      let windowWidth = window.outerWidth;
      let endWidth = window.outerWidth;
      let videoWrappers = document.querySelectorAll('.js-mapVideoWrapper');
      let videoTriggers = document.querySelectorAll('.js-videoTrigger');
      let mapTriggers = document.querySelectorAll('.js-mapTrigger');
      let slideTriggers = document.querySelectorAll('.js-slideTrigger');
      let videos = document.querySelectorAll('.js-ltpVideo');
      let nextBTNs = document.querySelectorAll('.js-btnNext');
      let prevBTNs = document.querySelectorAll('.js-btnPrev');
      let zoomBTNs = document.querySelectorAll('.js-btnZoom');
      let scrollDownBTNS = document.querySelectorAll('.js-toNextSection');
      let scrollUpBTNS = document.querySelectorAll('.js-toPrevSection');
      let anchorBTNS = document.querySelectorAll('a[href*="#"]:not([href="#"])');

      videoTriggers.forEach(videoTrigger => {
        videoTrigger.onclick = () => self._loadVideoPoint();
      });
      mapTriggers.forEach(mapTrigger => {
        mapTrigger.onclick = () => self._loadMapPoint();
      });
      slideTriggers.forEach(slideTrigger => {
        slideTrigger.onclick = () => self._loadSlidePoint();
      });
      nextBTNs.forEach(nextBTN => {
        nextBTN.onclick = () => self._navigate();
      });
      prevBTNs.forEach(prevBTN => {
        prevBTN.onclick = () => self._navigate();
      });
      zoomBTNs.forEach(zoomBTN => {
        zoomBTN.onclick = () => self._loadMapPoint();
      });
      scrollDownBTNS.forEach(scrollDBTN => {
        scrollDBTN.onclick = () => self._scrollToNextSection();
      });
      scrollUpBTNS.forEach(scrollUBTN => {
        scrollUBTN.onclick = () => self._scrollToPrevSection();
      });
      anchorBTNS.forEach(anchorBTN => {
        anchorBTN.onclick = () => self._scrollToSection();
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
            self._reMap();
            if(videos) {
              videos.forEach(function(video) {
                self._reVideo(video);
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

    _buildLearnToPlay() {
      let self = this;
      let ltpVideos = document.querySelectorAll('.js-mapVideoWrapper');
      let ltpMaps = document.querySelectorAll('.js-mapWrapper');
      let ltpSlides = document.querySelectorAll('.js-slideWrapper');
      if(ltpMaps.length > 0 || ltpVideos.length > 0) {
        //self.loader.show();
      }

      if(ltpMaps) {
        ltpMaps.forEach(function(ltpMap) {
          self._makeAnchors(ltpMap);
        });
      }

      if(ltpVideos) {
        ltpVideos.forEach(function(ltpVideo) {
          self._makeAnchors(ltpVideo);
          let thisVideo = ltpVideo.querySelector('.js-ltpVideo');
          self._checkLoad(thisVideo);
        });
      }

      if(ltpSlides) {
        ltpSlides.forEach(function(ltpSlide) {
          self._makeAnchors(ltpSlide);
        });
      }

      self._activateEventListeners();
    }
}