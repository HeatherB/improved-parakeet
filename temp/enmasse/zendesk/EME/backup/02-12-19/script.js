document.addEventListener('DOMContentLoaded', function() {
  function closest (element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector);
    }
    do {
      if (Element.prototype.matches && element.matches(selector)
        || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
        || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  }

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '', 'height = 500, width = 500');
    });
  });

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var commentContainerTextarea = document.querySelector('.comment-container textarea'),
    commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');

  if (commentContainerTextarea) {
    commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
      commentContainerFormControls.style.display = 'block';
      commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
    });

    if (commentContainerTextarea.value !== '') {
      commentContainerFormControls.style.display = 'block';
    }
  }

  // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
    requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
    requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function() {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
    requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
    requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function () {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true);
      requestCommentSubmitButton.disabled = true;
      this.setAttribute('data-disabled', true);
      // Element.closest is not supported in IE11
      closest(this, 'form').submit();
    });
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function() {
      if (requestCommentTextarea.value === '') {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
        }
        requestCommentSubmitButton.disabled = true;
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
        }
        requestCommentSubmitButton.disabled = false;
      }
    });
  }

  // Disable submit button if textarea is empty
  if (requestCommentTextarea && requestCommentTextarea.value === '') {
    requestCommentSubmitButton.disabled = true;
  }

  // Submit requests filter form in the request list page
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
    el.addEventListener('change', function(e) {
      e.stopPropagation();
      closest(this, 'form').submit();
    });
  });

  function toggleNavigation(toggleElement) {
    var menu = document.getElementById('user-nav');
    var isExpanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', !isExpanded);
    toggleElement.setAttribute('aria-expanded', !isExpanded);
  }

  var burgerMenu = document.querySelector('.header .icon-menu');
  var userMenu = document.querySelector('#user-nav');

  burgerMenu.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleNavigation(this);
  });

  burgerMenu.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) { // Enter key
      e.stopPropagation();
      toggleNavigation(this);
    }
  });

  userMenu.addEventListener('keyup', function(e) {
    if (e.keyCode === 27) { // Escape key
      e.stopPropagation();
      this.setAttribute('aria-expanded', false);
      burgerMenu.setAttribute('aria-expanded', false);
    }
  });

  if (userMenu.children.length === 0) {
    burgerMenu.style.display = 'none';
  }

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function() {
      closest(this, 'form').submit();
    });
  }

  // Toggles expanded aria to collapsible elements
  Array.prototype.forEach.call(document.querySelectorAll('.collapsible-nav, .collapsible-sidebar'), function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
    });
  });
  
  // Create a Twitch.Embed object that will render within the "twitch-embed" root element
  if($('#twitch-embed').length > 0) { 
				$.getJSON('https://api.twitch.tv/kraken/channels/enmasseentertainment?client_id=j9kdgpgan94hyl7xqj00fe15vg1vvo', function(channel) {
    			if (channel["stream"] == null) { 
            //THEY ARE OFFLINE DO WHATEVER HERE
      			// show videos os screenshot
            //$('#twitch-embed').html('<iframe src="https://api.twitch.tv/kraken/channels/enmasseentertainment/videos?client_id=j9kdgpgan94hyl7xqj00fe15vg1vvo" height="480" width="854" frameborder="0" scrolling="no" allowfullscreen="no"></iframe>');
          } else {
            //THEY ARE ONLINE DO WHATEVER HERE
            new Twitch.Embed("twitch-embed", {
              width: 854,
              height: 480,
              channel: "enmasseentertainment"
            });
         }
        });
	};
  
  // provided video id youtube embed
  if($('.video-here').length > 0) {
    var providedVideoId = $('.video-here').data("video");
    if(providedVideoId) {
      var videoBlock = '<iframe src="https://www.youtube.com/embed/' + providedVideoId + '?rel=0" frameborder="0" width="560" height="315"></iframe>';
      $('.video-here').append(videoBlock);
    }
  };
  
  // platform selection add to page
  var gatedPlatCallout = document.getElementById('platform-gated-here');
  // create a select, beacuse you cant just add one in the markdown
  var selectSelect = document.createElement('select');
  selectSelect.id = "filter-platform";
  //Create and append the options
  var platArr = ["all","windows","playstation","xbox"];
  for (var i = 0; i < platArr.length; i++) {
      var option = document.createElement("option");
      option.value = platArr[i];
      option.text = platArr[i];
      selectSelect.appendChild(option);
  };
  if(gatedPlatCallout) {
    //gatedPlatCallout.append(selectBlock);
    gatedPlatCallout.appendChild(selectSelect);
  };
  
  // platform selection for content toggle
  $('body').attr('data-selectedplat','all');
  var selectedPlat = document.getElementById('filter-platform');
  var selectedPlatVal;
  // capture initial value when element exists
  if(selectedPlat && selectedPlat.length > 0) {
    selectedPlatVal = selectedPlat.value;
    
    //capture changes to select
    document.querySelector('select[id="filter-platform"]').onchange=checkSelectedPlat;
  };
  
  function checkSelectedPlat(event) {
    if(!event.target.value) {
       //console.log('no change');
    } else {
      selectedPlatVal = selectedPlat.value;
      document.body.dataset.selectedplat = selectedPlatVal;
    }
  };
});
