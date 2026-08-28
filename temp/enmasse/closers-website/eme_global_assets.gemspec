Gem::Specification.new do |s|
  s.name        = 'eme_global_assets'
  s.version     = '0.5.5'
  s.date        = '2015-12-30'
  s.summary     = "Global Assets shared between projects"
  s.description = "HTML snippets, images, css, sass, and js shared across ruby projects"
  s.authors     = ["Heather Boylan"]
  s.email       = 'platform@enmasse.com'
  s.files       = Dir.glob("assets/**/*") + ["lib/eme_global_assets.rb", "lib/eme_global_assets/tasks/all.rb"]
  s.homepage    = 'https://github.com/enmasse-entertainment/eme_global_assets'
  s.license     = 'PRIVATE'
  
  s.add_runtime_dependency 'global_assets', '0.0.2'
  
  s.add_development_dependency 'minitest'
end
