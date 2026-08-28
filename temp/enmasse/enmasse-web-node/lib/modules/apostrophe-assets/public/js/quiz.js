var quizApp = {

	launchQuiz: function(event) {
		event.preventDefault();
		event.stopPropagation();

		/* remove landing page pieces */
		quizApp.Q.launch_quiz.closest('#dc_job_quiz').classList = 'quizzing';
		quizApp.Q.launch_quiz.closest('.inner').innerHTML = '';

		/* stuff first question and move quiz into play */
		quizApp.Q.question_section.setAttribute("data-question", quizApp.Q.selected_questions[0]);
		quizApp.Q.question_section.innerHTML = quizApp.questionSections[quizApp.Q.selected_questions[0]];
		quiz_outer.append(document.getElementById('quiz_form'));
		quizApp.Q.question_section.querySelector('h2').innerHTML = "Question 1";

		var advance_quiz = document.getElementById('move_on');
		advance_quiz.addEventListener('click', quizApp.advanceQuiz, false);

		/* start tracking form submissions */
		document.addEventListener('click', function(event) {
			if(quizApp.hasClass(event.target, 'quiz_radio')) {
				quizApp.showSelection();
			}
		});
	},

	hasClass: function(elem, className) {
	    return elem.className.split(' ').indexOf(className) > -1;
	},

	showSelection: function() {
		var selectedInput = event.target.value;
		quizApp.Q.selected_answer.innerHTML = selectedInput;
	},

	advanceQuiz: function() {
		if(quizApp.Q.selected_answer.innerHTML == '') {
			return
		}
		quizApp.Q.arr_of_answers.push(quizApp.Q.selected_answer.innerHTML);

		var question_section_count = quizApp.Q.question_section.getAttribute("data-question");

		quizApp.Q.question_arr_position++;

		quizApp.Q.question_label++;

		quizApp.getGrade(question_section_count, quizApp.Q.selected_answer.innerHTML);
		quizApp.Q.selected_answer.innerHTML = "";

		if(quizApp.Q.question_arr_position >= quizApp.Q.selected_questions.length) {
			quizApp.quizFinal();
		} else {
			quizApp.Q.question_section.setAttribute("data-question", quizApp.Q.selected_questions[quizApp.Q.question_arr_position]);
			quizApp.Q.question_section.innerHTML = quizApp.questionSections[quizApp.Q.selected_questions[quizApp.Q.question_arr_position]];
			quizApp.Q.question_section.querySelector('h2').innerHTML = "Question " + quizApp.Q.question_label;
		}
		
	},




suggestionSections: {
'gelfling_soldier': '<h2>Results</h2><figure data-scene="gelfling_soldier"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Soldier.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is SOLDIER. You\'ve got strong attacks and a hefty health bar, making you the best choice for the front line of any battle.</p></div>',
'gelfling_paladin': '<h2>Results</h2><figure data-scene="gelfling_paladin"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Paladin.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is PALADIN. You are a strong, frontline fighter who works well with other characters and can turn the tide of battle in an instant.</p></div>',
'stone_warden': '<h2>Results</h2><figure data-scene="stone_warden"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Stone_Warden.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is STONE WARDEN. Your strong affinity for Defense, combined with your abilities to add or remove status effects, make you a better than average combatant.</p></div>',
'grave_dancer': '<h2>Results</h2><figure data-scene="grave_dancer"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Grave_Dancer.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is GRAVE DANCER. Your time as both a THIEF and a PALADIN serves you well in your career, and your fluid, agile combat style reflects everything you\'ve learned about battle.</p></div>',
'scout': '<h2>Results</h2><figure data-scene="scout"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Scout.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is SCOUT. Mixing powerful ranged attacks and Status effects, you accelerate combat for both yourself and your teammates.</p></div>',
'thief': '<h2>Results</h2><figure data-scene="thief"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Thief.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is THIEF. Through clever movement and careful application of status effects, you control the battlefield and make it easier for your more martial allies to dominate it.</p></div>',
'tracker': '<h2>Results</h2><figure data-scene="tracker"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Tracker.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is TRACKER. As a ranged combat expert, you select the targets your allies need to attack, and seize the high ground in every engagement.</p></div>',
'strategist': '<h2>Results</h2><figure data-scene="strategist"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Strategist.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is STRATEGIST. Your time as both a STONE WARDEN and a BRAMBLE SAGE has taken your strategic combat style to another level, and your focused abilities complement those of your teammates, making you a deadly foe.</p></div>',
'mender': '<h2>Results</h2><figure data-scene="mender"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Mender.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is MENDER.  Through careful planning and more than a little healing, you keep your allies alive and ready to fight.</p></div>',
'bramble_sage': '<h2>Results</h2><figure data-scene="bramble_sage"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Bramble_Sage.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is BRAMBLE SAGE, but you’re no humble scholar—you are a spellcasting powerhouse who can dominate any encounter with a single action.</p></div>',
'adept': '<h2>Results</h2><figure data-scene="adept"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Adept.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is ADEPT. Your intensive study of Gelfling lore grants you powers incomprehensible to others, such as the ability the swap your HP with an ally, or to command the elements in battle.</p></div>',
'song_teller': '<h2>Results</h2><figure data-scene="song_teller"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Song_teller.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is SONG TELLER. Your time as both an ADEPT and a TRACKER serves you well in your career, and your intense combat style focuses on exploiting any advantage you can make or take.</p></div>',
'podling_paladin': '<h2>Results</h2><figure data-scene="podling_paladin"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Podling_Paladin.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is PALADIN. You are a focused and stalwart combatant, who picks a spot on the battlefield and has the right abilities to defend it from all comers.</p></div>',
'musician': '<h2>Results</h2><figure data-scene="musician"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Musician.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is MUSICIAN. Your skilled playing can lock down an enemy or lift up an ally, sometimes both at the same time.</p></div>',
'cook': '<h2>Results</h2><figure data-scene="cook"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Cook.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is COOK. Often overlooked, your culinary skills translate exceptionally well to crowd control and surprise attacks, making you a remarkably deadly opponent.</p></div>',
'potion_master': '<h2>Results</h2><figure data-scene="potion_master"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Potion_Master.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is POTION MASTER. Your specialty brews unlock your allies\' potential (and your own) while distracting and damaging your foes.</p></div>',
'tamer': '<h2>Results</h2><figure data-scene="tamer"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Tamer.jpg" target="_blank"></a></figure><div class="about primary"><p>Your Primary job is TAMER. Your ability to turn wild Nurlocs into friendly ones has many applications for the resistance, not the least of which is protecting and augmenting your allies.</p></div>',
'medic': '<h2>Results</h2><figure data-scene="medic"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Fizzgig_Medic.jpg" target="_blank"></a></figure><div class="about primary"><p>You are a MEDIC.  You roll around the battle, helping where you can, while at the same time looking for opportunities to take out weakened enemies.</p></div>',
'herder': '<h2>Results</h2><figure data-scene="herder"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Fizzgig_Herder.jpg" target="_blank"></a></figure><div class="about primary"><p>You are a HERDER. You take the battle to the enemy wherever they are, then maneuver them into positions of disadvantage before you strike.</p></div>'
},

subgestionSections: {
'gelfling_soldier': '<div class="about secondary"><p>Your Secondary job is SOLDIER. You\'ve got strong attacks and a hefty health bar, making you the best choice for the front line of any battle.</p></div>',
'gelfling_paladin': '<div class="about secondary"><p>Your Secondary job is PALADIN. You are a strong, frontline fighter who works well with other characters and can turn the tide of battle in an instant</p></div>',
'stone_warden': '<div class="about secondary"><p>Your Secondary job is STONE WARDEN. You have strong affinities towards defense as opposed to offense.</p></div>',
'grave_dancer': '<div class="about secondary"><p>Your Secondary job is GRAVE DANCER. Your time as both a THIEF and a PALADIN serves you well in your career, and your fluid, agile combat style reflects everything you\'ve learned about battle.</p></div>',
'scout': '<div class="about secondary"><p>Your Secondary job is SCOUT. Mixing powerful ranged attacks and Status effects, you accelerate combat for both yourself and your teammates.</p></div>',
'thief': '<div class="about secondary"><p>Your Secondary job is THIEF. Through clever movement and careful application of status effects, you control the battlefield and make it easier for your more martial allies to dominate it.</p></div>',
'tracker': '<div class="about secondary"><p>Your Secondary job is TRACKER. As a ranged combat expert, you select the targets your allies need to attack, and seize the high ground in every engagement.</p></div>',
'strategist': '<div class="about secondary"><p>Your Secondary job is STRATEGIST. Your time as both a STONE WARDEN and a BRAMBLE SAGE has taken your strategic combat style to another level, and your focused abilities complement those of your teammates, making you a deadly foe.</p></div>',
'mender': '<div class="about secondary"><p>Your Secondary job is MENDER.  Through careful planning and more than a little healing, you keep your allies alive and ready to fight.</p></div>',
'bramble_sage': '<div class="about secondary"><p>Your Secondary job is BRAMBLE SAGE, but you\'re no humble scholar—you are a spellcasting powerhouse who can dominate any encounter with a single action.</p></div>',
'adept': '<div class="about secondary"><p>Your Secondary job is ADEPT. Your intensive study of Gelfling lore grants you powers incomprehensible to others, such as the ability the swap your HP with an ally, or to command the elements in battle.</p></div>',
'song_teller': '<div class="about secondary"><p>Your Secondary job is SONG TELLER. Your time as both an ADEPT and a TRACKER serves you well in your career, and your intense combat style focuses on exploiting any advantage you can make or take.</p></div>',
'podling_paladin': '<div class="about secondary"><p>Your Secondary job is PALADIN. You are a focused and stalwart combatant, who picks a spot on the battlefield and has the right abilities to defend it from all comers.</p></div>',
'musician': '<div class="about secondary"><p>Your Secondary job is MUSICIAN. Your skilled playing can lock down an enemy or lift up an ally, sometimes both at the same time.</p></div>',
'cook': '<div class="about secondary"><p>Your Secondary job is COOK. Often overlooked, your culinary skills translate exceptionally well to crowd control and surprise attacks, making you a remarkably deadly opponent.</p></div>',
'potion_master': '<div class="about secondary"><p>Your Secondary job is POTION MASTER. Your specialty brews unlock your allies\' potential (and your own) while distracting and damaging your foes.</p></div>',
'tamer': '<div class="about secondary"><p>Your Secondary job is TAMER. Your ability to turn wild Nurlocs into friendly ones has many applications for the resistance, not the least of which is protecting and augmenting your allies!</p></div>',
'medic': '<div class="about secondary"><p>Your Secondary job is MEDIC. You roll around the battle, helping where you can, while at the same time looking for opportunities to take out weakened enemies.</p></div>',
'herder': '<div class="about secondary"><p>Your Secondary job is HERDER. You take the battle to the enemy wherever they are, then maneuver them into positions of disadvantage before you strike.</p></div>'
},

mediaSections: {
'gelfling_soldier': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>SHOVE:</strong> Knock a target back 3 tiles. If it is Stunned inflict -Defense down and Magic defense down.</li><li><strong>RECKLESS BLOW:</strong> Attack with -20 accuracy and increased damage.</li><li><strong>SHARPEN BLADE:</strong> Grant Attack up and Critical Chance up to an ally for three turns.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/soldier.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/soldier.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/soldier.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'gelfling_paladin': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>DOUBLE STRIKE:</strong> Attack marked target twice.</li><li><strong>HEROIC LEAP:</strong> Jump to an empty tile no more than one elevation higher and deal damage to all adjacent enemies.</li><li><strong>CLEAVE:</strong> Attack an enemy and damage Heroes adjacent to it.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/gelfling_paladin.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/paladin.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/paladin.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'stone_warden': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>TAUNT:</strong> Inflict Berserk to targets in an area for three turns.</li><li><strong>HINDER:</strong> Attack an enemy and delay its turn by 40 Recovery.</li><li><strong>TANGLE UP:</strong> Attack and inflict root for two turns to all adjacent targets.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/stone_warden.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/stone_warden.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/stone_warden.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'grave_dancer': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>DEATH’S INSTINCT:</strong> Attack a marked target with +100% critical chance. Take your next turn sooner. Consume Marked.</li><li><strong>RENDING WHIRL:</strong> Attack and inflict wounded to all adjacent targets for three turns.</li><li><strong>POISONED BLADES:</strong> Chance to inflict Poison and Root with basic attacks.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/grave_dancer.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/grave_dancer.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/grave_dancer.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'scout': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>SWIFT STRIKE:</strong> Attack after moving three tiles.</li><li><strong>MARK:</strong> Mark a target, reducing its Evasion for three turns.</li><li><strong>ENTANGLING BOA:</strong> Attack and Inflict Root on an enemy for one turn.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/scout.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/scout.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/scout.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'thief': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>EVASIVE:</strong> Gain +15 evasion.</li><li><strong>DARING STRIKE:</strong> Attack a Marked and Poison Target.</li><li><strong>STEAL LIFE:</strong> Attack and heal self for 45% of damage done.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/thief.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/thief.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/thief.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'tracker': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>AIMED SHOT:</strong> Attack a marked enemy. Consume mark.</li><li><strong>EYE SHOT:</strong> Deal damage to an enemy and inflict Blind and Evasion Down for three turns.</li><li><strong>FLEET SHOT:</strong> Attack and take your next turn sooner.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/tracker.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/tracker.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/tracker.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'strategist': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>SHOCKWAVE:</strong> Deal damage and inflict stun on targets in a line.</li><li><strong>EVEN THE ODDS:</strong> Target ally adjacent to two or more enemies and grant Attack up, Barrier, Majic Up, Shell, and Haste for three turns.</li><li><strong>AIM FOR THE GAPS:</strong> Attack a Marked enemy with 100% Critical Chance.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/strategist.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/strategist.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/strategist.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'mender': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>CONVALESCENCE:</strong> Heal and grant MP to targets in an area.</li><li><strong>CLEANSE:</strong>  Remove all statuses from a target. Take your next turn sooner.</li><li><strong>AWAKEN:</strong> Revive a knocked out ally.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/mender.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/mender.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/mender.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'bramble_sage': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>FIREMOSS BUNDLE:</strong> Deal damage to targets in an area.</li><li><strong>GEYSER:</strong>  Deal damage to every target in a line.</li><li><strong>AUGHRA\'S IRE:</strong> Inflict magic defense down to targets in an area for five turns.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/bramble_sage.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/bramble_sage.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/bramble_sage.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'adept': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>GALE:</strong> Deal damage in a line and knock targets back three tiles.</li><li><strong>LIFE EXCHANGE:</strong> Swap caster\'s current HP percentage with the target’s current HP percentage. Cannot target Bosses.</li><li><strong>GUARDIAN\'S BLESSING:</strong> Grant a status for three turns that automatically revises a knocked out ally. Revived allies have 25% hp and barrier for one turn.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/adept.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/adept.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/adept.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'song_teller': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>GRAND CONCERT:</strong> Heal all allies and inflict stun on self for one turn.</li><li><strong>MOTIVATING CHORD:</strong> Grant Attack Up and Majic Up to an ally for two turns. Ally takes next turn 50 recovery sooner.</li><li><strong>ENCHANTING TUNE:</strong> Inflict stun on an enemy.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/song_teller.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/song_teller.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/song_teller.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'podling_paladin': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>THWACK:</strong> Attack and enemy and knock it back three tiles.</li><li><strong>LEND A HAND:</strong> Remove all negative statuses from an ally.</li><li><strong>MUDBALL:</strong> Attack and inflict Blind and Move Down for three turns on a critical hit.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/podling_paladin.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/podling_paladin.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/podling_paladin.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'musician': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>ULTIMATE SOLO:</strong> Deal damage to all enemies and heal all allies. Only useable with two positive statuses.</li><li><strong>AD-LIB:</strong> Randomly grant between two and four positive statuses to an adjacent ally.</li><li><strong>PERFORM:</strong> All adjacent allies take their turns sooner.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/musician.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/musician.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/musician.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'cook': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>SEASONING CLOUD:</strong> Deal damage and inflict spiced to target in area for two turns.</li><li><strong>TENDERIZE:</strong> Attack a spiced enemy three times. Consume spiced.</li><li><strong>CAULDRON:</strong> Summon a cauldron that heals adjacent Heroes. Heroes may only control one summon.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/cook.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/cook.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/cook.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'potion_master': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>MYSTERY BREW:</strong> Inflict random Negative Statuses on an enemy.</li><li><strong>ACRID ACID:</strong> Inflict Attack Down, Defense Down, and Slow on a marked target for three turns. Consume mark.</li><li><strong>BOTTLED BLIGHT:</strong> Deal damage and inflict poison on an enemy, creating a puddle on the tile that damages Heroes.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/potion_master.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/potion_master.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/potion_master.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'tamer': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>CALL PET:</strong> Summon a stronger friendly Nurloc. Heroes may only control one summoned ally.</li><li><strong>FEEDING TIME:</strong> Heal a friendly beast.</li><li><strong>COMMAND:</strong> Allow a friendly beast to take its turn immediately. Grant it attack up.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/tamer.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/tamer.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/tamer.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'medic': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>GET \'EM:</strong> Attack and inflict wounded for three turns.</li><li><strong>LICK WOUNDS:</strong> Heal an adjacent ally.</li><li><strong>SHAKE \'EM OFF:</strong> Deal damage and knock all adjacent enemies back two squares. Only useable with Barrier.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted poster="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/posters/fizzgig_medic.jpg"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/fizzgig_medic.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/fizzgig_medic.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>',
'herder': '<div id="media_block"><div class="media"><div class="col"><h3>Key Skills</h3><ul><li><strong>MUNCH:</strong> Attack a marked target five times with -40 accuracy.</li><li><strong>FUZZY METEOR:</strong> Jump down to a lower elevation and damage all adjacent targets.</li><li><strong>MAD GNASH:</strong> Attack all adjacent targets.</li></ul></div><div class="col"><div class="videoWrapper" id="skill_vid_area"><video controls autoplay loop muted><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/herder.webm" type="video/webm"><source src="https://eme03.enmasse-game.com/images/dark_crystal_tactics/quiz/videos/converted/herder.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video></div></div></div></div>'
},

shareSections: {
'gelfling_soldier': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=soldier" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dsoldier&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Soldier.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=soldier&text=I%20got%20Soldier%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'gelfling_paladin': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=paladin" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dpaladin&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Paladin.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=paladin&text=I%20got%20Gelfing%20Paladin%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'stone_warden': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=stone_warden" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dstone_warden&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Stone_Warden.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=stone_warden&text=I%20got%20Stone%20Warden%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'grave_dancer': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=grave_dancer" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dgrave_dancer&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Grave_Dancer.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=grave_dancer&text=I%20got%20Grave%20Dancer%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'scout': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=scout" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dscout&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Scout.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=scout&text=I%20got%20Scout%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'thief': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=thief" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dthief&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Thief.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=thief&text=I%20got%20Thief%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'tracker': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=tracker" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dtracker&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Tracker.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=tracker&text=I%20got%20Tracker%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'strategist': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=strategist" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dstrategist&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Strategist.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=strategist&text=I%20got%20Strategist%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'mender': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=mender" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dmender&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Mender.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=mender&text=I%20got%20Mender%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'bramble_sage': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=bramble_sage" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dbramble_sage&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Bramble_Sage.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=bramble_sage&text=I%20got%20Bramble%20Sage%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'adept': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=adept" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dadept&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Adept.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=adept&text=I%20got%20Adept%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'song_teller': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=song_teller" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dsong_teller&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Song_teller.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=song_teller&text=I%20got%20Song%20Teller%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'podling_paladin': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=podling_paladin" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dpodling_paladin&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Podling_Paladin.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=podling_paladin&text=I%20got%20Podling%20Paladin%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'musician': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=musician" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dmusician&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Musician.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=musician&text=I%20got%20Musician%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'cook': '<div class="dc_quiz_share"><<div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=cook" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dcook&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Cook.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=cook&text=I%20got%20Cook%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'potion_master': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=potion_master" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dpotion_master&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Potion_Master.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=potion_master&text=I%20got%20Potion%20Master%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'tamer': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=tamer" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dtamer&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Tamer.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=tamer&text=I%20got%20Tamer%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'medic': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=Fizzgig_Medic" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3Dfizzgig_medic&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Fizzgig_Medic.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=Fizzgig_Medic&text=I%20got%20Medic%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>',
'herder': '<div class="dc_quiz_share"><div id="share_facebook" class="fb-share-button share_btn" data-href="https://enmasse.com/darkcrystaltactics-quiz?primary=Fizzgig_Herder" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fenmasse.com%2Fdarkcrystaltactics-quiz%3Fprimary%3DFizzgig_Herder&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div><div id="share_instagram" class="instagram-share-button share_btn"><a href="https://eme01.enmasse-game.com/images/dark_crystal_tactics/quiz/wallpapers/Fizzgig_Herder.jpg" target="_blank"></a></div><a id="share_twitter" class="twitter-share-button share_btn" target="_blank" href="https://twitter.com/intent/tweet?url=https://enmasse.com/darkcrystaltactics-quiz?primary=Fizzgig_Herder&text=I%20got%20Fizzgig%20Herder%20In%20The%20DarkCrystal:%20Age%20of%20Resistance%20Tactics%20job%20quiz!%20Find%20out%20which%20job%20you%20are:%20https://enmasse.com/darkcrystaltactics-quiz">Tweet</a></div><div class="dc_quiz_pre"><p>The Dark Crystal: Age of Resistance Tactics is available for pre-purchase on Nintendo Switch, Xbox One, Steam, PC & OSX, and GOG.</p><a class="btn_purple" target="_blank" id="quiz_prepurchase" href="/the-dark-crystal-age-of-resistance-tactics-official-site?prepurchase=now">Pre-purchase Now</a></div>'
},

questionSections: {
'0': '<h2>Question </h2><figure data-scene="podling_tavern_01"></figure><p>Several Gelfling Adepts and Soldiers have pushed you back into a corner. With limited space to manuever, do you:</p><input type="radio" id="a" name="q1" value="a" class="quiz_radio" /><label for="a"><span>Attempt your most powerful attack on the biggest opponent.</span></label><input type="radio" id="b" name="q1" value="b" class="quiz_radio" /><label for="b"><span>Attack all Gelfling foes in front of you.</span></label><input type="radio" id="c" name="q1" value="c" class="quiz_radio" /><label for="c"><span>Attack a single foe and push them back.</span></label><input type="radio" id="d" name="q1" value="d" class="quiz_radio" /><label for="d"><span>Bite \'em until they bleed.</span></label>',
'1': '<h2>Question </h2><figure data-scene="podling_tavern_02"></figure><p>Ambushed by Gelfling loyalists, you bravely charge into the fray to buy your allies time to escape. Surrounded by enemies, do you:</p><input type="radio" id="a" name="q2" value="a" class="quiz_radio" /><label for="a"><span>Root all enemies in front of you.</span></label><input type="radio" id="b" name="q2" value="b" class="quiz_radio" /><label for="b"><span>Seize the high ground and attack all adjacent enemies.</span></label><input type="radio" id="c" name="q2" value="c" class="quiz_radio" /><label for="c"><span>Grab a seasoned spoon and let them have it!</span></label><input type="radio" id="d" name="q2" value="d" class="quiz_radio" /><label for="d"><span>Choose a target, open your mouth, and Munch down hard!</span></label>',
'2': '<h2>Question </h2><figure data-scene="gobbles_01"></figure><p>A band of Gelfling Paladins and Scouts is lurking just out of rock range. What\'s your plan for when they close the gap and attack?</p><input type="radio" id="a" name="q3" value="a" class="quiz_radio" /><label for="a"><span>Shove one of them into the pit with the Gobbles.</span></label><input type="radio" id="b" name="q3" value="b" class="quiz_radio" /><label for="b"><span>Attack an enemy so forcefully they lose initiative.</span></label><input type="radio" id="c" name="q3" value="c" class="quiz_radio" /><label for="c"><span>Wait and Stun an enemy in front of your ally.</span></label><input type="radio" id="d" name="q3" value="d" class="quiz_radio" /><label for="d"><span>Roll yourself into position to attack and wound an enemy.</span></label>',
'3': '<h2>Question </h2><figure data-scene="gobbles_02"></figure><p>You\'re in close combat with a band of Gelfling Loyalists. What\'s your next move?</p><input type="radio" id="a" name="q4" value="a" class="quiz_radio" /><label for="a"><span>Attack and wound all nearby enemies.</span></label><input type="radio" id="b" name="q4" value="b" class="quiz_radio" /><label for="b"><span>Critically attack a Marked enemy.</span></label><input type="radio" id="c" name="q4" value="c" class="quiz_radio" /><label for="c"><span>Poison an enemy.</span></label><input type="radio" id="d" name="q4" value="d" class="quiz_radio" /><label for="d"><span>Roll down and damage all nearby enemies.</span></label>',
'4': '<h2>Question </h2><figure data-scene="gobbles_03"></figure><p>A Gelfling Scout has thrown a bola at your ally, and is advancing for the kill. You manuever yourself in front of your friend, and have time for one quick attack. What do you do?</p><input type="radio" id="a" name="q5" value="a" class="quiz_radio" /><label for="a"><span>Hit them with a spoon!</span></label><input type="radio" id="b" name="q5" value="b" class="quiz_radio" /><label for="b"><span>Play a power chord and save the day!</span></label><input type="radio" id="c" name="q5" value="c" class="quiz_radio" /><label for="c"><span>Bite them!</span></label><input type="radio" id="d" name="q5" value="d" class="quiz_radio" /><label for="d"><span>Throw up a Barrier!</span></label>',
'5': '<h2>Question </h2><figure data-scene="forest_01"></figure><p>You stumble into a nest of Arathim Spitters, who quickly surround you and your allies. What do you do?</p><input type="radio" id="a" name="q6" value="a" class="quiz_radio" /><label for="a"><span>Mark a Spitter for an ally to attack.</span></label><input type="radio" id="b" name="q6" value="b" class="quiz_radio" /><label for="b"><span>Drop a poison cloud on them.</span></label><input type="radio" id="c" name="q6" value="c" class="quiz_radio" /><label for="c"><span>Thow a vial of ink at them.</span></label><input type="radio" id="d" name="q6" value="d" class="quiz_radio" /><label for="d"><span>YAP! Increase their movement and clear their path.</span></label>',
'6': '<h2>Question </h2><figure data-scene="forest_02"></figure><p>Darkened Nurlocs have slithered in from all sides. What do you do?</p><input type="radio" id="a" name="q7" value="a" class="quiz_radio" /><label for="a"><span>Fire off a quick ranged attack, and then another.</span></label><input type="radio" id="b" name="q7" value="b" class="quiz_radio" /><label for="b"><span>Attack a Nurloc and steal some of its health.</span></label><input type="radio" id="c" name="q7" value="c" class="quiz_radio" /><label for="c"><span>Pick out an enemy to target with a status effect.</span></label><input type="radio" id="d" name="q7" value="d" class="quiz_radio" /><label for="d"><span>Bite them!</span></label>',
'7': '<h2>Question </h2><figure data-scene="crystal_01"></figure><p>Gelfling Stone Wardens are moving in to attack, but you have a couple turns until they engage. What do you do?</p><input type="radio" id="a" name="q8" value="a" class="quiz_radio" /><label for="a"><span>Prepare for the attack and increase your Evasion.</span></label><input type="radio" id="b" name="q8" value="b" class="quiz_radio" /><label for="b"><span>Blind an oncoming enemy and lower its Evasion.</span></label><input type="radio" id="c" name="q8" value="c" class="quiz_radio" /><label for="c"><span>Position yourself carefully for a surprise attack.</span></label><input type="radio" id="d" name="q8" value="d" class="quiz_radio" /><label for="d"><span>Roll into position to attack lots of enemies.</span></label>',
'8': '<h2>Question </h2><figure data-scene="crystal_02"></figure><p>Right before your big attack, the enemy in front of you withdraws. What\'s your backup plan?</p><input type="radio" id="a" name="q9" value="a" class="quiz_radio" /><label for="a"><span>Boost an ally with multiple status effects.</span></label><input type="radio" id="b" name="q9" value="b" class="quiz_radio" /><label for="b"><span>Motivate an ally with the perfect cheer!</span></label><input type="radio" id="c" name="q9" value="c" class="quiz_radio" /><label for="c"><span>Position yourself carefully for a surprise attack.</span></label><input type="radio" id="d" name="q9" value="d" class="quiz_radio" /><label for="d"><span>Roll into position to attack lots of enemies.</span></label>',
'9': '<h2>Question </h2><figure data-scene="crystal_03"></figure><p>You discover a nest of Arathim Spitters and Tanks while exploring a narrow pass. What do you do?</p><input type="radio" id="a" name="q10" value="a" class="quiz_radio" /><label for="a"><span>Summon a friendly Nurloc to defend you.</span></label><input type="radio" id="b" name="q10" value="b" class="quiz_radio" /><label for="b"><span>Throw a mudball to distract them.</span></label><input type="radio" id="c" name="q10" value="c" class="quiz_radio" /><label for="c"><span>YAP! Make a battle cry to boost an ally.</span></label><input type="radio" id="d" name="q10" value="d" class="quiz_radio" /><label for="d"><span>Bite them!</span></label>',
'10': '<h2>Question </h2><figure data-scene="podling_tavern_03"></figure><p>Angry patrons have surrounded your group. One of your allies is nearly dead, but so is the enemy leader. What do you do?</p><input type="radio" id="a" name="q11" value="a" class="quiz_radio" /><label for="a"><span>Throw up a barrier to protect your allies.</span></label><input type="radio" id="b" name="q11" value="b" class="quiz_radio" /><label for="b"><span>Use a line of fire to damage your enemies.</span></label><input type="radio" id="c" name="q11" value="c" class="quiz_radio" /><label for="c"><span>Play a jaunty tune to inspire your allies.</span></label><input type="radio" id="d" name="q11" value="d" class="quiz_radio" /><label for="d"><span>Lick your ally\'s wounds (in a nice way).</span></label>',
'11': '<h2>Question </h2><figure data-scene="gobbles_04"></figure><p>Gelfling Paladins and Sages have backed you into a corner and are closing in for the kill. Your next action will decide the battle. Do you:</p><input type="radio" id="a" name="q12" value="a" class="quiz_radio" /><label for="a"><span>Knock your enemies back with a blast of wind.</span></label><input type="radio" id="b" name="q12" value="b" class="quiz_radio" /><label for="b"><span>Decrease your enemies\' defense so your allies can attack.</span></label><input type="radio" id="c" name="q12" value="c" class="quiz_radio" /><label for="c"><span>Command your Nurloc to charge into battle.</span></label><input type="radio" id="d" name="q12" value="d" class="quiz_radio" /><label for="d"><span>Roll up and Munch on the enemy leader.</span></label>',
'12': '<h2>Question </h2><figure data-scene="forest_03"></figure><p>Gelfling Thieves have surprised you on the trail, and attacked you with poisoned weapons. What do you do?</p><input type="radio" id="a" name="q13" value="a" class="quiz_radio" /><label for="a"><span>Toss off a fast fiery spell to give your healers time to work.</span></label><input type="radio" id="b" name="q13" value="b" class="quiz_radio" /><label for="b"><span>Poison them first with a cloud of toxic fumes.</span></label><input type="radio" id="c" name="q13" value="c" class="quiz_radio" /><label for="c"><span>Use a cauldron to prepare a nutritious broth. Your friends are going to need it!</span></label><input type="radio" id="d" name="q13" value="d" class="quiz_radio" /><label for="d"><span>Roll up and attack the nearest enemy.</span></label>',
'13': '<h2>Question </h2><figure data-scene="crystal_04"></figure><p>Your allies are pinned down, and only you are free to act. How will you save the day?</p><input type="radio" id="a" name="q14" value="a" class="quiz_radio" /><label for="a"><span>Heal all your allies with a majestic performance.</span></label><input type="radio" id="b" name="q14" value="b" class="quiz_radio" /><label for="b"><span>Unleash whirling death on your enemies.</span></label><input type="radio" id="c" name="q14" value="c" class="quiz_radio" /><label for="c"><span>Perform a song that damages all enemies and scouts all allies.</span></label><input type="radio" id="d" name="q14" value="d" class="quiz_radio" /><label for="d"><span>Bite everyone in a frenzied, gnashing attack.</span></label>',
'14': '<h2>Question </h2><figure data-scene="forest_04"></figure><p>Bramble Sages have you and your allies trapped. How do you break free?</p><input type="radio" id="a" name="q15" value="a" class="quiz_radio" /><label for="a"><span>Summon a Nurloc to cover your escape.</span></label><input type="radio" id="b" name="q15" value="b" class="quiz_radio" /><label for="b"><span>Throw everything you have into three quick attacks.</span></label><input type="radio" id="c" name="q15" value="c" class="quiz_radio" /><label for="c"><span>Use the power of your Barrier to knock them back.</span></label><input type="radio" id="d" name="q15" value="d" class="quiz_radio" /><label for="d"><span>Bite everyone in a frenzied, gnashing attack.</span></label>',
'15': '<h2>Question </h2><figure data-scene="boss_01"></figure><p>The Skeksis have unleashed their mightiest warrior, the Hunter! You have time for one action before he closes. What do you do?</p><input type="radio" id="a" name="q16" value="a" class="quiz_radio" /><label for="a"><span>Tangle up his minions and slow their movement.</span></label><input type="radio" id="b" name="q16" value="b" class="quiz_radio" /><label for="b"><span>Attack the Hunter twice in a row.</span></label><input type="radio" id="c" name="q16" value="c" class="quiz_radio" /><label for="c"><span>Attack the Hunter and knock him back.</span></label><input type="radio" id="d" name="q16" value="d" class="quiz_radio" /><label for="d"><span>Increase the movement of your allies.</span></label>',
'16': '<h2>Question </h2><figure data-scene="boss_02"></figure><p>The General\'s minions are swarming you. With every order he gives, your job gets harder. How will you stop him?</p><input type="radio" id="a" name="q17" value="a" class="quiz_radio" /><label for="a"><span>Perform a reckless attack which deals massive damage.</span></label><input type="radio" id="b" name="q17" value="b" class="quiz_radio" /><label for="b"><span>Damage the General and mark him for your allies to attack.</span></label><input type="radio" id="c" name="q17" value="c" class="quiz_radio" /><label for="c"><span>Use your instrument to grant Positive Statuses to your allies.</span></label><input type="radio" id="d" name="q17" value="d" class="quiz_radio" /><label for="d"><span>Munch on a Marked target as fast as you can.</span></label>',
'17': '<h2>Question </h2><figure data-scene="boss_03"></figure><p>The Chamberlain and the General have teamed up, and you have no choice but to attempt escape. What\'s your plan for leaving battle?</p><input type="radio" id="a" name="q18" value="a" class="quiz_radio" /><label for="a"><span>Throw rocks. ALL OF THEM!</span></label><input type="radio" id="b" name="q18" value="b" class="quiz_radio" /><label for="b"><span>Attack one of the Skeksis and try to slow their advance.</span></label><input type="radio" id="c" name="q18" value="c" class="quiz_radio" /><label for="c"><span>Throw a potion to gain a random Positive Status.</span></label><input type="radio" id="d" name="q18" value="d" class="quiz_radio" /><label for="d"><span>YAP! Make a battle cry to boost an ally.</span></label>',
'18': '<h2>Question </h2><figure data-scene="boss_04"></figure><p>The Emperor, the Scientist, and the Chamberlain are about to unleash their attacks in rapid succession, but you still have one chance to protect your allies. What do you do?</p><input type="radio" id="a" name="q19" value="a" class="quiz_radio" /><label for="a"><span>Heal and grant MP to nearby allies.</span></label><input type="radio" id="b" name="q19" value="b" class="quiz_radio" /><label for="b"><span>Share your MP with nearby allies.</span></label><input type="radio" id="c" name="q19" value="c" class="quiz_radio" /><label for="c"><span>Create a magical shell around your Nurloc and adjacent allies.</span></label><input type="radio" id="d" name="q19" value="d" class="quiz_radio" /><label for="d"><span>YAP! Make a battle cry to boost an ally.</span></label>',
'19': '<h2>Question </h2><figure data-scene="boss_05"></figure><p>The Scientist attacked you with lightning and managed to poison you. You\'re done for, but you can help one ally escape the battlefield and save the day. What do you do?</p><input type="radio" id="a" name="q20" value="a" class="quiz_radio" /><label for="a"><span>Try to poison the Skeksis and reduce his movement while your ally escapes.</span></label><input type="radio" id="b" name="q20" value="b" class="quiz_radio" /><label for="b"><span>Give your ally Attack Up, Barrier, Magic Up, Shell, and Haste for three turns.</span></label><input type="radio" id="c" name="q20" value="c" class="quiz_radio" /><label for="c"><span>Heal your ally and grant them one turn of Haste.</span></label><input type="radio" id="d" name="q20" value="d" class="quiz_radio" /><label for="d"><span>Cover your ally\'s retreat with an attack.</span></label>',
'20': '<h2>Question </h2><figure data-scene="boss_06"></figure><p>The Gelfling are all cowering in front of the Chamberlain, but you, a lowly Podling, have a chance to save them! What do you do?</p><input type="radio" id="a" name="q21" value="a" class="quiz_radio" /><label for="a"><span>Play a song that lets your allies take their turns sooner.</span></label><input type="radio" id="b" name="q21" value="b" class="quiz_radio" /><label for="b"><span>Detonate a summoned ally and rain down poison broth to cover your retreat.</span></label><input type="radio" id="c" name="q21" value="c" class="quiz_radio" /><label for="c"><span>Throw a vial of acid to lower his Attack and Defense.</span></label><input type="radio" id="d" name="q21" value="d" class="quiz_radio" /><label for="d"><span>Boost your allies\' Evasion and create a Shell around your Nurloc and adjacent allies.</span></label>',
'21': '<h2>Question </h2><figure data-scene="boss_07"></figure><p>The Scientist is briefly distracted, giving you a chance to save the day in true Fizzgig fashion. What do you do?</p><input type="radio" id="a" name="q22" value="a" class="quiz_radio" /><label for="a"><span>Steal one of the Scientist\'s buffs and use it to cover your allies\' escape.</span></label><input type="radio" id="b" name="q22" value="b" class="quiz_radio" /><label for="b"><span>Perform a brilliant bite, emboldening all allies and upping their Attack.</span></label><input type="radio" id="c" name="q22" value="c" class="quiz_radio" /><label for="c"><span>Bark loudy, hoping to startle him.</span></label><input type="radio" id="d" name="q22" value="d" class="quiz_radio" /><label for="d"><span>Curl up into a fuzzy ball. Perhaps he won\'t notice you.</span></label>'
},

getRandomInt: function(max) {
  return Math.floor(Math.random() * Math.floor(max));
},

getGrade: function(thisQuestion, thisAnswer) {
	
	if(thisQuestion == 0) {
		/* question 1 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.grave_dancer += 4;

			quizApp.selected_job.stone_warden += 6;

			quizApp.selected_job.gelfling_paladin += 6;

			quizApp.selected_job.gelfling_soldier += 9;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.grave_dancer += 4;

			quizApp.selected_job.stone_warden += 6;

			quizApp.selected_job.gelfling_paladin += 9;

			quizApp.selected_job.gelfling_soldier += 6;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;

			quizApp.selected_job.podling_paladin += 9;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.herder += 3;

			quizApp.selected_job.medic += 6;
		}
	}
	
	if(thisQuestion == 1) {
		/* question 2 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.grave_dancer += 4;

			quizApp.selected_job.gelfling_soldier += 6;

			quizApp.selected_job.gelfling_paladin += 6;

			quizApp.selected_job.stone_warden += 9;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.grave_dancer += 4;

			quizApp.selected_job.gelfling_soldier += 6;

			quizApp.selected_job.gelfling_paladin += 9;

			quizApp.selected_job.stone_warden += 6;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.podling_paladin += 4;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 9;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 2) {
		/* question 3 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.grave_dancer += 4;

			quizApp.selected_job.gelfling_soldier += 6;

			quizApp.selected_job.stone_warden += 6;

			quizApp.selected_job.scout += 6;

			quizApp.selected_job.gelfling_paladin += 9;

		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.grave_dancer += 4;

			quizApp.selected_job.stone_warden += 9;

			quizApp.selected_job.gelfling_paladin += 6;

			quizApp.selected_job.gelfling_soldier += 6;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.strategist += 6;

			quizApp.selected_job.podling_paladin += 9;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.herder += 3;

			quizApp.selected_job.medic += 6;
		}
	}

	if(thisQuestion == 3) {
		/* question 4 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.gelfling_soldier += 4;

			quizApp.selected_job.gelfling_paladin += 6;

			quizApp.selected_job.grave_dancer += 9;

			quizApp.selected_job.scout += 4;

			quizApp.selected_job.thief += 4;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.gelfling_soldier += 4;

			quizApp.selected_job.stone_warden += 4;

			quizApp.selected_job.tracker += 4;

			quizApp.selected_job.strategist += 9;

			quizApp.selected_job.mender += 4;

			quizApp.selected_job.bramble_sage += 4;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.thief += 4;

			quizApp.selected_job.bramble_sage += 4;

			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 9;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 4) {
		/* question 5 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.podling_paladin += 9;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 6;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.song_teller += 6;

			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 9;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 6;

			quizApp.selected_job.herder += 3;
		}
	}

	if(thisQuestion == 5) {
		/* question 6 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.scout += 9;

			quizApp.selected_job.thief += 6;

			quizApp.selected_job.tracker += 6;

			quizApp.selected_job.strategist += 4;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.scout += 6;

			quizApp.selected_job.thief += 9;

			quizApp.selected_job.tracker += 6;

			quizApp.selected_job.strategist += 4;

			quizApp.selected_job.bramble_sage += 4;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 9;

			quizApp.selected_job.tamer += 3;

		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 6;

			quizApp.selected_job.herder += 3;
		}
	}

	if(thisQuestion == 6) {
		/* question 7 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.scout += 6;

			quizApp.selected_job.thief += 6;

			quizApp.selected_job.tracker += 9;

			quizApp.selected_job.strategist += 4;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.scout += 6;

			quizApp.selected_job.thief += 9;

			quizApp.selected_job.tracker += 9;

			quizApp.selected_job.strategist += 4;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 4;

			quizApp.selected_job.cook += 9;

			quizApp.selected_job.potion_master += 4;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 7) {
		/* question 8 rating */
		if(thisAnswer  == 'a') {
			quizApp.selected_job.scout += 6;

			quizApp.selected_job.thief += 9;

			quizApp.selected_job.tracker += 6;

			quizApp.selected_job.strategist += 4;
		}
		if(thisAnswer  == 'b') {
			quizApp.selected_job.scout += 6;

			quizApp.selected_job.thief += 6;

			quizApp.selected_job.tracker += 9;

			quizApp.selected_job.strategist += 4;
		}
		if(thisAnswer  == 'c') {
			quizApp.selected_job.podling_paladin += 4;

			quizApp.selected_job.musician += 4;

			quizApp.selected_job.cook += 4;

			quizApp.selected_job.potion_master += 4;

			quizApp.selected_job.tamer += 4;
		}
		if(thisAnswer  == 'd') {
			quizApp.selected_job.medic += 4;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 8) {
		/* question 9 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.gelfling_soldier += 4;

			quizApp.selected_job.stone_warden += 4;

			quizApp.selected_job.strategist += 9;

			quizApp.selected_job.mender += 4;

			quizApp.selected_job.adept += 4;

			quizApp.selected_job.medic += 3;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.scout += 4;

			quizApp.selected_job.tracker += 4;

			quizApp.selected_job.mender += 4;

			quizApp.selected_job.adept += 4;

			quizApp.selected_job.song_teller += 9;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.podling_paladin += 4;

			quizApp.selected_job.musician += 4;

			quizApp.selected_job.cook += 4;

			quizApp.selected_job.potion_master += 4;

			quizApp.selected_job.tamer += 4;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 4;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 9) {
		/* question 10 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 9;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.bramble_sage += 4;

			quizApp.selected_job.podling_paladin += 9;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.adept += 6;

			quizApp.selected_job.medic += 6;

			quizApp.selected_job.herder += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 10) {
		/* question 11 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.mender += 9;

			quizApp.selected_job.bramble_sage += 4;

			quizApp.selected_job.adept += 6;

			quizApp.selected_job.song_teller += 4;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.mender += 6;

			quizApp.selected_job.bramble_sage += 9;

			quizApp.selected_job.adept += 6;

			quizApp.selected_job.song_teller += 4;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.song_teller += 6;

			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 9;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 6;

			quizApp.selected_job.herder += 3;
		}
	}

	if(thisQuestion == 11) {
		/* question 12 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.mender += 6;

			quizApp.selected_job.bramble_sage += 6;

			quizApp.selected_job.adept += 9;

			quizApp.selected_job.song_teller += 4;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.mender += 6;

			quizApp.selected_job.bramble_sage += 9;

			quizApp.selected_job.adept += 6;

			quizApp.selected_job.song_teller += 4;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 9;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 12) {
		/* question 13 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.mender += 6;

			quizApp.selected_job.bramble_sage += 9;

			quizApp.selected_job.adept += 9;

			quizApp.selected_job.song_teller += 4;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.thief += 4;

			quizApp.selected_job.mender += 6;

			quizApp.selected_job.bramble_sage += 9;

			quizApp.selected_job.adept += 6;

			quizApp.selected_job.song_teller += 4;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 9;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 6;

			quizApp.selected_job.herder += 3;
		}
	}

	if(thisQuestion == 13) {
		/* question 14 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.scout += 4;

			quizApp.selected_job.tracker += 4;

			quizApp.selected_job.mender += 4;

			quizApp.selected_job.adept += 4;

			quizApp.selected_job.song_teller += 9;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.gelfling_soldier += 4;

			quizApp.selected_job.gelfling_paladin += 4;

			quizApp.selected_job.grave_dancer += 9;

			quizApp.selected_job.scout += 4;

			quizApp.selected_job.thief += 4;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 9;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 14) {
		/* question 15 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 9;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.tracker += 4;

			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 9;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.medic += 6;

			quizApp.selected_job.herder += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 15) {
		/* question 16 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.gelfling_soldier += 6;

			quizApp.selected_job.gelfling_paladin += 6;

			quizApp.selected_job.stone_warden += 9;

			quizApp.selected_job.stone_warden += 4;

			quizApp.selected_job.bramble_sage += 6;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.gelfling_soldier += 6;

			quizApp.selected_job.gelfling_paladin += 9;

			quizApp.selected_job.stone_warden += 6;

			quizApp.selected_job.grave_dancer += 4;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.podling_paladin += 9;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 6;

			quizApp.selected_job.herder += 3;
		}
	}

	if(thisQuestion == 16) {
		/* question 17 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.gelfling_soldier += 9;

			quizApp.selected_job.gelfling_paladin += 6;

			quizApp.selected_job.stone_warden += 6;

			quizApp.selected_job.grave_dancer += 4;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.gelfling_soldier += 4;

			quizApp.selected_job.gelfling_paladin += 4;

			quizApp.selected_job.stone_warden += 4;

			quizApp.selected_job.grave_dancer += 9;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.strategist += 4;

			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 9;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.tracker += 4;

			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 17) {
		/* question 18 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.scout += 9;

			quizApp.selected_job.thief += 6;

			quizApp.selected_job.tracker += 6;

			quizApp.selected_job.strategist += 4;

			quizApp.selected_job.bramble_sage += 4;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.scout += 4;

			quizApp.selected_job.thief += 4;

			quizApp.selected_job.tracker += 4;

			quizApp.selected_job.strategist += 9;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.strategist += 4;

			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 9;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 6;

			quizApp.selected_job.herder += 3;
		}
	}

	if(thisQuestion == 18) {
		/* question 19 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.mender += 9;

			quizApp.selected_job.bramble_sage += 4;

			quizApp.selected_job.adept += 6;

			quizApp.selected_job.song_teller += 4;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.mender += 4;

			quizApp.selected_job.bramble_sage += 4;

			quizApp.selected_job.adept += 4;

			quizApp.selected_job.song_teller += 9;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 9;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
	}

	if(thisQuestion == 19) {
		/* question 20 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.gelfling_soldier += 4;

			quizApp.selected_job.gelfling_paladin += 4;

			quizApp.selected_job.grave_dancer += 9;

			quizApp.selected_job.scout += 4;

			quizApp.selected_job.thief += 9;

			quizApp.selected_job.bramble_sage += 4;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.gelfling_soldier += 4;

			quizApp.selected_job.stone_warden += 4;

			quizApp.selected_job.strategist += 9;

			quizApp.selected_job.mender += 4;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.scout += 4;

			quizApp.selected_job.tracker += 4;

			quizApp.selected_job.mender += 4;

			quizApp.selected_job.adept += 6;

			quizApp.selected_job.song_teller += 9;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.grave_dancer += 6;

			quizApp.selected_job.strategist += 6;

			quizApp.selected_job.song_teller += 6;
		}
	}

	if(thisQuestion == 20) {
		/* question 21 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 9;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 9;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 9;

			quizApp.selected_job.tamer += 3;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.podling_paladin += 3;

			quizApp.selected_job.musician += 3;

			quizApp.selected_job.cook += 3;

			quizApp.selected_job.potion_master += 3;

			quizApp.selected_job.tamer += 9;
		}
	}

	if(thisQuestion == 21) {
		/* question 22 rating */
		if(thisAnswer == 'a') {
			quizApp.selected_job.medic += 6;

			quizApp.selected_job.herder += 3;
		}
		if(thisAnswer == 'b') {
			quizApp.selected_job.medic += 3;

			quizApp.selected_job.herder += 6;
		}
		if(thisAnswer == 'c') {
			quizApp.selected_job.medic += 6;

			quizApp.selected_job.herder += 6;
		}
		if(thisAnswer == 'd') {
			quizApp.selected_job.medic += 4;

			quizApp.selected_job.herder += 4;
		}
	}
},


quizFinal: function() {
	var suggested_job = 'Cook';

	/* take array and find matching values so we can tie-break and end up with one match */
	perfect_job =  Object.keys(quizApp.selected_job).filter(function(x) {
		return quizApp.selected_job[x] == Math.max.apply(null, Object.values(quizApp.selected_job));
	});

	if(Array.isArray(perfect_job)) {
		suggested_job = perfect_job[quizApp.getRandomInt(perfect_job.length)];
	} else {
		suggested_job = perfect_job;
	}

	/* turn object into array so we can sort numerically by the values */
	var second_sort = [];
	for(jobe in quizApp.selected_job) {
		second_sort.push([jobe, quizApp.selected_job[jobe]]);
	}
	second_sort.sort(function(a,b) {
		return a[1] - b[1]
	});

	/* how many results in perfect jobs, remove those from secondary job options */
	var perfect_job_length = 1;
	if(perfect_job.length > 1) {
		perfect_job_length = perfect_job.length;
	}

	var remove_perfect_job = second_sort.splice(-1 * perfect_job_length);
	/* second sort is now converted and only outputs its culled version */

	var second_suggested_job_options = second_sort.slice((second_sort.length - 3));

	if(Array.isArray(second_suggested_job_options)) {
		second_suggested_job = second_suggested_job_options[quizApp.getRandomInt(second_suggested_job_options.length)];
	} else {
		second_suggested_job = second_sort.pop();
	}

	quizApp.displayJob(suggested_job, second_suggested_job);
},

displayJob: function(perfect_job, second_perfect_job) {
	event.preventDefault();
	event.stopPropagation();

	/* remove exisitng quiz pieces */
	document.getElementById('dc_job_quiz').classList = 'suggesting';
	quiz_outer.innerHTML = '';

	/* stuff results */
	quizApp.Q.the_suggest_form.innerHTML = quizApp.suggestionSections[perfect_job];
	quiz_outer.append(quizApp.Q.the_suggest_form);

	quizApp.Q.the_subgest_form.innerHTML = quizApp.subgestionSections[second_perfect_job[0]];
	quiz_outer.append(quizApp.Q.the_subgest_form);

	quizApp.Q.the_media_form.innerHTML = quizApp.mediaSections[perfect_job];
	quiz_outer.append(quizApp.Q.the_media_form);

	quizApp.Q.the_share_form.innerHTML = quizApp.shareSections[perfect_job];
	quiz_outer.append(quizApp.Q.the_share_form);

},


buildQuiz: function() {
	total_questions = Object.keys(quizApp.questionSections).length;

	var random_array = new Array(total_questions).fill().map(function (a, i) {
	  return a = i;
	}).sort(function () {
	  return Math.random() - 0.5;
	});

	quizApp.Q.selected_questions = random_array.slice(0, 7);

	if(quizApp.Q.launch_quiz) {
		quizApp.Q.launch_quiz.addEventListener('click', quizApp.launchQuiz, false);
	}
},

selected_job: {
	gelfling_soldier: 0,
	gelfling_paladin: 0,
	stone_warden: 0,
	grave_dancer: 0,
	scout: 0,
	thief: 0,
	tracker: 0,
	strategist: 0,
	mender: 0,
	bramble_sage: 0,
	adept: 0,
	song_teller: 0,
	podling_paladin: 0,
	musician: 0,
	cook: 0,
	potion_master: 0,
	tamer: 0,
	medic: 0,
	herder: 0
},

Q: {
	launch_quiz: document.getElementById('start_dc_quiz'),
	arr_of_answers: [],
	question_section: document.getElementById('question_section'),
	the_quiz_form: document.getElementById('quiz_form'),
	perfect_job: 'cook',
	second_perfect_job: 'cook',

	the_suggest_form: document.getElementById('suggestion_block'),
	the_subgest_form: document.getElementById('subgestion_block'),
	the_media_form: document.getElementById('media_block'),
	the_share_form: document.getElementById('share_block'),
	selected_answer: document.getElementById('selected_answer'),

	selected_questions: '',
	total_questions: '',
	question_arr_position: 0,
	question_label: 1
}

}; // end quiz app

var quiz_outer = document.getElementById('quiz_outer');
if(quiz_outer) {
quizApp.buildQuiz();
}