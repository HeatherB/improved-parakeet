<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  @if(is_page_template('templates/template-insider-landing.blade.php') || is_page_template('templates/page-users.blade.php'))
    <link href="//amp.azure.net/libs/amp/latest/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
    <script src= "//amp.azure.net/libs/amp/latest/azuremediaplayer.min.js"></script>
  @endif

    <link rel="shortcut icon" href="@asset('images/favicon.ico')" type="image/x-icon">
	<link rel="stylesheet" href="https://use.typekit.net/bhu7zvc.css">
    
  @php(wp_head())
</head>
