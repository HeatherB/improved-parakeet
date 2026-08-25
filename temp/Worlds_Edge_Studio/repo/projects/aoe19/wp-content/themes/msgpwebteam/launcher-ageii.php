<?php
/*
Template Name: Age II Launcher
*/
?>
<html>
	<head>
		<title>Age II Launcher</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
				border: 0;
				overflow-x: hidden;
				overflow-y: auto;
			}
			body {
				background: #000 url(<?php echo get_template_directory_uri(); ?>/images/ageiibkground.jpg) top left;*/
			}
			p {
				line-height: 1.5em;
				font-family: segoe-ui-normal, Helvetica, Roboto, Arial, sans-serif;
				margin-bottom: 10px;
			}
			#container {
				
				width: 600px;
				height: expression( this.scrollHeight < 401 ? "400px" : "auto" );
				min-height: 400px;
				position: relative;
				top: 0;				
			}
			/*#header {
				background: #000 url(./header.jpg) top left no-repeat;
				height: 20px;
			}*/
			#hero {
				/*background: #000 url(./body.png) top left repeat-y;
				padding-left: 9px;*/
			}
			#body {				
				padding: 5px;
				width: 390px;
				color: #fff;
				float: left;
			}
	        #sidebar {
	            float: right;
	            padding-top: 5px;
	            width: 190px;
	            text-align: center;
	        }
	        #sidebar>div {
	        	padding: 5px;
	        }

		</style>
	</head>
<body>
<?php while ( have_posts() ) : the_post(); ?>
<div id="container">
	<div id="header"></div>
	<?php if( have_rows('link') ): ?>
		<div id="sidebar">
		    <?php while( have_rows('link') ): the_row(); ?>
		 

		        <div>
		            <a href="<?php the_sub_field('link_url'); ?>" target="_blank">
		                <img src="<?php the_sub_field('link_image'); ?>" alt="<?php the_sub_field('link_text'); ?>" /></a>
		        </div>
		        
		    <?php endwhile; ?>
	    </div>
    <?php endif; ?>
	<div id="body">
		<div id="hero">
			<a href="<?php the_field('hero_link'); ?>" target="_blank"><img src="<?php the_field('hero_image'); ?>"></a><br />
		</div>	
		<?php the_content(); ?>
	</div>	
	<div id="footer"></div>
</div>
<?php endwhile; ?>
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-45447305-5', 'auto');
        ga('send', 'pageview');

    </script>
</body>
</html>