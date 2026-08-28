class AMS::Root < Grape::API
  mount AMS::Private::Root
  mount AMS::Public::Root

  add_swagger_documentation mount_path:              'swagger_doc',
                            hide_documentation_path: true,
                            api_version:             'v1',
                            hide_format:             true,
                            base_path:               '',
                            markdown:                GrapeSwagger::Markdown::KramdownAdapter.new
end
