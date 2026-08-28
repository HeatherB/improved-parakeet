/*
 * Image preview script 
 * powered by jQuery (http://www.jquery.com)
 * 
 * written by Alen Grakalic (http://cssglobe.com)
 * 
 * for more info visit http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery
 *
 */
 
this.imagePreview = function(){
  /* CONFIG */
    
    yOffset = 10;
    xOffset = 30;
    
    // these 2 variable determine popup's distance from the cursor
    // you might want to adjust to get the right result
    
  /* END CONFIG */
  $("a.preview").hover(function(e){
    var strContents = "";
    var strCssClass = "";
    this.t = this.title;
    this.title = "";
    if (!$(this).hasClass("preview")) return; // if we want to remove the tooltip (e.g. remove disabled button text)
    
    if ($(this).attr("data-img") != null) {
      strContents += "<img src='"+ $(this).attr("data-img") +"' alt='Image preview' />";
      strCssClass = "image";
    } if (this.t != "") {
      if (strContents != "") strContents += "<br />";
      strContents += "<p>" + this.t + "</p>";
      strCssClass = "text";
    }

    $("body").append("<div id='preview' class='" + strCssClass + "'>"+ strContents +"</div>");
    $("#preview")
      .css("top",(e.pageY - yOffset) + "px")
      .css("left",(e.pageX + xOffset) + "px")
      .fadeIn("fast");
    },
  function(){
    this.title = this.t;
    $("#preview").remove();
    }); 
  $("a.preview").mousemove(function(e){
    if (!$(this).hasClass("preview")) return; // if we want to remove the tooltip (e.g. remove disabled button text)
    $("#preview")
      .css("top",(e.pageY - yOffset) + "px")
      .css("left",(e.pageX + xOffset) + "px");
  }); 
};

this.imagePreviewRounded = function(){
  /* CONFIG */
    
    yOffset = 15;
    xOffset = 10;
    
    // these 2 variable determine popup's distance from the cursor
    // you might want to adjust to get the right result
    
  /* END CONFIG */
  $("a.preview-rounded").hover(function(e){
    var strContents = "";
    var strCssClass = "";
    this.t = this.title;
    this.title = "";
    if (!$(this).hasClass("preview-rounded")) return; // if we want to remove the tooltip (e.g. remove disabled button text)
    
    if ($(this).attr("data-img") != null) {
      strContents += "<img src='"+ $(this).attr("data-img") +"' alt='Image preview' />";
      strCssClass = "image";
    } if (this.t != "") {
      if (strContents != "") strContents += "<br />";
      strContents += "<p style='font-size:16px;'>" + this.t + "</p>";
      strCssClass = "text";
    }

    $("body").append("<div id='preview-rounded' class='" + strCssClass + "'>"+ strContents +"</div>");

    $("#preview-rounded")
      .css("top",(e.pageY - yOffset) + "px")
      .css("left",(e.pageX + xOffset) + "px")
      .fadeIn("fast");
    },
  function(){
    this.title = this.t;
    $("#preview-rounded").remove();
    }); 
  $("a.preview-rounded").mousemove(function(e){
    if (!$(this).hasClass("preview-rounded")) return; // if we want to remove the tooltip (e.g. remove disabled button text)

    element = $("#preview-rounded");

    if (e.pageX + xOffset + element.width() > window.innerWidth) {
      element.addClass("right")
      element.css("top",(e.pageY - yOffset) + "px").css("left",(e.pageX - element.width() - xOffset) + "px");
    } else {
      element.removeClass("right")
      element.css("top",(e.pageY - yOffset) + "px").css("left",(e.pageX + xOffset) + "px");
    }
  }); 
};

// starting the script on page load
$(document).ready(function(){
  imagePreview();
  imagePreviewRounded();
});