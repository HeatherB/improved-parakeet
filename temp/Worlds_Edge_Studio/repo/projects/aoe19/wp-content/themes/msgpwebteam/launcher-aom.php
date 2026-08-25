<?php
/*
Template Name: AOM Launcher
*/
?>
<html>
	<head>
		<title>AOM Launcher</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
				border: 0;
				overflow-x: hidden;
				overflow-y: auto;
			}
			body {
				background: #000;
			}
			p {
				line-height: 1.5em;
				font-family: segoe-ui-normal, Helvetica, Roboto, Arial, sans-serif;
				margin-bottom: 10px;
			}
			#container {
				background: #000 url(<?php echo get_template_directory_uri(); ?>/images/launcher_body.png) top left repeat-y;
				width: 418px;
				height: expression( this.scrollHeight < 601 ? "600px" : "auto" );
				min-height: 600px;
				position: relative;
				top: 0;				
			}
			#header {
				background: #000 url(<?php echo get_template_directory_uri(); ?>/images/launcher_header.jpg) top left no-repeat;
				height: 20px;
			}
			#hero {
				padding-left: 9px;
			}
			#body {				
				padding: 5px 15px 10px 15px;
				width: 391px;
				color: #fff;
			}
			#footer {
				background: transparent url(<?php echo get_template_directory_uri(); ?>/images/launcher_footer.jpg) bottom left no-repeat;
				height: 20px;
				width: 418px;
				position: absolute;
				bottom: 0;
			}

		</style>
	</head>
<body>
<?php while ( have_posts() ) : the_post(); ?>
	<div id="container">
		<div id="header"></div>
		<div id="hero">
			<a href="<?php the_field('hero_link'); ?>" target="_blank"><img src="<?php the_field('hero_image'); ?>"></a><br />
		</div>
		<div id="body">
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

        ga('create', 'UA-45447305-12', 'ageofempires.com');
        ga('send', 'pageview');
    </script>
</body>
</html>