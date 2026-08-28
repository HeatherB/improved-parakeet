/*
    How to use this mapping code

    Step 1: HTML Template as follows. Styles for this can be found in _map.scss

    <input type="hidden" id="map-controller" value="1" />

    <div id="map">
        <video width="100%" height="786px" autoplay="autoplay" loop="loop">
            <source src="https://eme01.enmasse-game.com/images/closers/map/map_background.mp4" type="video/mp4" />
        </video>
        <img id="map-img" src="https://eme01.enmasse-game.com/images/closers/map/map.png" alt="Map" />
        <div id="lines">

        </div>
        <div id="points">

        </div>
    </div>

    *******
    The hidden input "map-controller" controls the current active point. Example: A value of 3 will mean point 3 
    and previous points 1 & 2 are completed and point 4 is in progress
    *******

    Step 2: Set the "points" array below to your list of points on the map, giving them coordinates. Lines will be
    automatically generated between the points.
*/


$(function() {
    if ($(document.body).hasClass("map")) {
        var map = $("#map");
        var linesCont = $("#lines");
        var pointsCont = $("#points");
        var controller = parseInt($("#map-controller").val());
        var progress = parseInt($("#goal-progress").val());
        var capturePoints = $("#points-to-capture").val();
        var yourPoints = $("#your-points").val();
        var size = {
            width: 90,
            height: 50
        }
        var currentPoint = 0;

        // point object
        var Point = function(cords) {
            this.cords = cords;
            this.status = "inactive";
            var template = "<div id='point-" + currentPoint + "' class='point inactive' style='top: " + this.cords.y + "px; left: " + this.cords.x + "px;'></div>";
            pointsCont.append(template);
            this.node = $("#point-" + currentPoint);
            this.position = currentPoint;
            currentPoint++;

            this.node.mouseenter(function() {
                $("#points").css( 'cursor', 'pointer' );
                this.node.append("<img class='hover' src='https://eme01.enmasse-game.com/images/closers/map/compressed/portal-hover.png' />");
                showHover(this);
            }.bind(this));

            this.node.mouseout(function() {
                $("#points").css( 'cursor', 'initial' );
                $(".hover").remove();
                clearHover(this);
            }.bind(this));
        }

        // array of points to be appended to "points" div and displayed on image
        var points = [
            new Point({x: 422, y: 169}),
            new Point({x: 610, y: 219}),
            new Point({x: 760, y: 205}),
            new Point({x: 934, y: 388}),
            new Point({x: 660, y: 378}),
            new Point({x: 480, y: 365}),
            new Point({x: 200, y: 267}),
            new Point({x: 84, y: 505}),
            new Point({x: 330, y: 440}),
            new Point({x: 500, y: 443}),
            new Point({x: 775, y: 583})
        ];

        // generate lines between points, skip last point
        for (var i = 0; i < points.length - 1; i++) {
            //var template = '<svg id="svg" width="100%" height="100%"><line id="line" x1="${points[i].x + size.width/2}" y1="${points[i].y + size.height/2}" x2="${points[i + 1].x + size.width/2}" y2="${points[i + 1].y + size.height/2}" /></svg>';
            var template = '<svg width="100%" height="100%"><line id="line-' + i + '" x1="' + (points[i].cords.x + size.width/2) + '" y1="' + (points[i].cords.y + size.height/2) + '" x2="' + (points[i + 1].cords.x + size.width/2) + '" y2="' + (points[i + 1].cords.y + size.height/2) + '" /></svg>';
            linesCont.append(template);
        }

        // white progress line class
        var ProgressLine = function(position, maxPercent) {
            var template = '<svg width="100%" height="100%"><line id="progress-line-' + position + '" class="progress" x1="' + (points[position - 1].cords.x + size.width/2) + '" y1="' + (points[position - 1].cords.y + size.height/2) + '" x2="' + (points[position - 1].cords.x + size.width/2) + '" y2="' + (points[position - 1].cords.y + size.height/2) + '"  /></svg>';
            linesCont.append(template);
            this.currentPercent = 0;
            this.maxPercent = maxPercent || 100;

            var startX = points[position - 1].cords.x + size.width / 2;
            var endX = points[position].cords.x + size.width / 2;
            var onePercentX = (endX - startX) / 100; // one percent pixel value for x

            var startY = points[position - 1].cords.y + size.height / 2;
            var endY = points[position].cords.y + size.height / 2;
            var onePercentY = (endY - startY) / 100; // one percent pixel value for y

            this.interval = setInterval(function() {
                var x2 = startX + onePercentX * this.currentPercent;
                var y2 = startY + onePercentY * this.currentPercent;
                $("#progress-line-" + position).attr('x2', x2);
                $("#progress-line-" + position).attr('y2', y2);
                if (this.currentPercent == this.maxPercent) {
                    clearInterval(this.interval);
                }
                this.currentPercent++;
            }.bind(this), 10);
        }

        // marker animation on page load
        var moveMarker = function(position, maxPercent, finalIteration) {
            var marker = $("#marker");
            this.maxPercent = maxPercent || 100;
            this.finalIteration = finalIteration || false;
            if (position != 0) {
                // Move the marker with Javascript so it lines up with the white svg line, css transition doesn't work here because they don't line up
                var startX = points[position - 1].cords.x - 5;
                var endX = points[position].cords.x - 5;
                var onePercentX = (endX - startX) / 100; // one percent pixel value for x
    
                var startY = points[position - 1].cords.y - 76;
                var endY = points[position].cords.y - 76;
                var onePercentY = (endY - startY) / 100; // one percent pixel value for y

                // set to in progress
                $(points[position].node).removeClass("inactive");
                $(points[position].node).addClass("active");
    
                this.currentPercent = 0;
                this.interval = setInterval(function() {
                    var x2 = startX + onePercentX * this.currentPercent;
                    var y2 = startY + onePercentY * this.currentPercent;
                    marker.css("left", x2);
                    marker.css("top", y2);
                    if (this.currentPercent == this.maxPercent) {
                        // set the portal to active
                        if (this.maxPercent == 100) {
                            $(points[position].node).removeClass("active");
                            $(points[position].node).addClass("complete");
                            // change line
                            $("#line-" + position).addClass("blue");
                            $(points[position + 1].node).addClass("active");
                        }
                        // clear timer
                        clearInterval(this.interval);

                        if (this.finalIteration) {
                            // add stopped class to marker
                            $("#marker").addClass("stopped");
                            $("#marker").append("<div class='marker-points'><span>Your Point Total:</span> " + yourPoints + "</div>");
                        }

                    }
                    this.currentPercent++;
                }.bind(this), 10);
                new ProgressLine(position, maxPercent); // create a new white progress line
            } else {
                // set the portal to active
                $(points[position].node).removeClass("inactive");
                $(points[position].node).addClass("complete");
                $("#line-" + position).addClass("blue");
                $(points[position + 1].node).addClass("active");
            }

            if (position < controller && position != points.length - 1) { // if marker isn't at final point, iterate again
                setTimeout(function() {
                    new moveMarker(++position);
                }, 2000);
            } else if (position == controller) {
                setTimeout(function() {
                    new moveMarker(++position, progress, true);
                }, 2000);
            }
        }

        if (controller > -1) {
            new moveMarker(0);
        } else {
            $("#point-0").removeClass("inactive");
            $("#point-0").addClass("active");
        }

        function showHover(point) {
            var info = $("#reward-" + point.position);
            var imageSrc = info.find("img").attr('src');
            var title = info.find("h3").text();
            var rewards = info.find("p").html();
            var status = "";
            var direction = "left";
            var pointsToGoal = "<div class='points-to-capture'>Points to capture: Locked</div>";

            if (point.position > controller + 1) { // not completed
                status = "inactive";
                rewards = "Rewards: <br /> Unknown";
            } else if (point.position < controller + 1) {
                status = "complete";
            }

            if (point.cords.x < 500) {
                direction = "right";
            }

            if ($(point.node).hasClass("active")) {
                pointsToGoal = "<div class='points-to-capture'>Points to capture: " + capturePoints + "</div>";
            } else if ($(point.node).hasClass("complete")) {
                pointsToGoal = "<div class='points-to-capture'>Points to capture: Captured</div>";
            }

            $("#points").css("z-index", "20");
            var template = "<div class='point-hover " + status + " " + direction + "'><h3>" + title + "</h3><img src='" + imageSrc + "' />" + pointsToGoal + "<p>" + rewards + "</p></div>";
            point.node.append(template);
        }

        function clearHover(point) {
            $("#points").css("z-index", "3");
            $(".point-hover").remove();
        }

        var locked = $("#locked section");
        for (var i = 0; i < locked.length; i++) {
            if (i == controller + 1) {
                $("#current-goals").append(locked[i]);
            } else if (i <= controller) {
                $("#unlocked").append(locked[i]);
            }
        }

        $("#current-goals section p").prepend("<strong class='current-points-prepend' style='display: block; margin-bottom: 10px;'>Points to Capture: " + capturePoints + "<br /></strong>");

    }
});