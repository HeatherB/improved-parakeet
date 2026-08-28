var characterClick = document.querySelectorAll('.character_icon');
var characterReveal = document.querySelectorAll('.character_reveal');
var characterClose = document.querySelectorAll('.character_close');
var characterGallery = document.querySelector('#character_gallery');


characterClick.forEach(function(clickChar) {
   clickChar.addEventListener("click", loadCharacter);
   clickChar.addEventListener("touchstart", loadCharacter);
});

characterClose.forEach(function(closeChar) {
   closeChar.addEventListener("click", closeCharacter);
   closeChar.addEventListener("touchstart", closeCharacter);
});

function loadCharacter(event) {
  var whichCharacter = event.currentTarget.getAttribute('data-characterreveal');

  characterReveal.forEach(function(revealChar) {
    if(revealChar.getAttribute('data-characterabout') == whichCharacter) {
      revealChar.classList.add('selected');
    }
  });
  characterGallery.classList.add('hidden');
};

function closeCharacter(event) {
  characterReveal.forEach(function(revealCharClose) {
      revealCharClose.classList.remove('selected');
  });
  characterGallery.classList.remove('hidden');
};
