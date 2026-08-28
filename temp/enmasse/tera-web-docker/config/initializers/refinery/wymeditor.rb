# encoding: utf-8
Refinery::Wymeditor.configure do |config|
  # Add extra tags to the wymeditor whitelist e.g. = {'a' => {'attributes': '1': 'href'}} or just {'a' => {}}
  config.whitelist_tags = {
    'iframe' => {
      'attributes': {
        '1': 'allowfullscreen',
        '2': 'src',
        '3': 'width',
        '4': 'height',
        '5': 'frameborder',
        '6': 'scrolling',
        '7': 'marginheight',
        '8': 'marginwidth'
      }
    },
    'video' => {
      'attributes' => {
        '1' => 'width',
        '2' => 'height',
        '3' => 'poster',
        '4' => 'autoplay',
        '5' => 'controls',
        '6' => 'class',
        '7' => 'preload',
        '8' => 'loop',
        '9' => 'muted'
      }
    },
    'source' => {
      'attributes' => {
        '1' => 'src',
        '2' => 'type'
      }
    },
    'widget' => {
      'attributes' => {
        '1' => 'name'
      }
    }
    'figure' => {
      'attributes' => {
        '1' => 'name'
      }
    }
  }

  # Toggle the paste dialog when using browser paste.
  # You will have to clear your asset cache after changing this setting.
  # In development mode: this is as simple as: `rm -rf tmp/cache/assets`.
  # In production mode: hopefully you recompile assets every time you deploy.
  # config.intercept_paste = true
end