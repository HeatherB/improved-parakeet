<div class="game-stats">
	<?php // Age 2 DE specific templates
    if(get_query_var('game') == "age2") { ?>
	    <div class="heading_help">
            <h3>Recent Matches</h3>
            <a class="how_help_link" target="_blank" href="/support/aoe2/#replay-download">How do I use the replay files?</a>
        </div>
        <select id="game_mode_select_bottom" >
            <option value="3" selected >1v1 RandomMap</option>
            <option value="1">1v1 Deathmatch</option>
            <option value="4">Team RandomMap</option>
            <option value="2">Team Deathmatch</option>
        </select>
        <div class="no-results recent-matches"></div>
    <?php } else { ?>
    	 <div class="game-stats__equal">
	        <h2 class="h3 light">Game Stats</h2>
	    </div>
    <?php  } ?>
    <div class="game-stats__equal">
        <div class="pagination-container mpmatches-pagination js-pageNav"></div>
    </div>
</div>