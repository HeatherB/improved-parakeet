# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  include ExceptionLogger::ExceptionLoggable, AuthenticatedSystem, MaintenanceHelper, TsltHelper, LanguageSelector, Iovation::AccountFilter, AMS::SSOFilter
          # SslRequirement

  rescue_from Exception, :with => :log_exception_handler

  protect_from_forgery

  helper_method :current_user, :logged_in?, :admin?, :last_active, :logout_inactive, :logout_deleted,
                :in_launcher?, :current_game_id

  after_filter :set_headers
  before_filter :logout_deleted #, :logout_banned
  before_filter :persist_referrer
  before_filter :validate_engarde
  before_filter :validate_additional_requirements
  after_filter :store_location
  after_filter :mark_user_active

  #
  # OAuth (Doorkeeper)

  # we re-define below function differently from what originally it was
  # to prevent it renders something
  module Doorkeeper
    module Rails
      module Helpers
        def doorkeeper_render_error
        end
      end
    end
  end

  #
  # include required oauth Modules for controllers
  def self.inherited(subclass)
    super
    subclass.instance_eval do
      include AbstractController::Callbacks
      include ActionController::Head
      include Doorkeeper::Rails::Helpers
    end
  end

  # OAuth (end)
  #
  around_filter :cache_other_db_connections

  protected

  def set_global_alerts
    @global_alerts = GlobalAlert.for_path(request.path)
  end

  def persist_referrer
    session[:original_referrer] ||= request.referer.present? ? request.referer : ""
  end

  def form_dupe_protection
    token = params[:update_token]

    unless token.nil?
      if session[:update_token] != token
        flash[:warning] = "This request has already been processed."
        redirect_back_or_default index_path
      else
        session[:update_token] = nil
      end
    end
  end

  def validate_engarde
    if logged_in? && current_user.io_auth_required? && current_user.authorize_next_device?
      # if authorize_next_device? is true and a user signs in for the first time, allow it
      device = current_user.user_devices.find_by_io_device_alias(current_user.io_device_alias)
      if device.present?
        device.authorization_required = false
        device.save!
        current_user.io_auth_required = false
        current_user.authorize_next_device = false
        current_user.save!
      end
    end
    if logged_in? && current_user.io_auth_required?
      redirect_to engarde_verification_users_account_path
    end
  end

  def validate_additional_requirements
    if logged_in? && current_user.secret_question_id.nil? && !current_user.allow_blank_secret
      redirect_to additional_requirements_users_path
    end
  end

  def current_game_id
    session[:launcher_embed].to_i
  end

  def in_launcher?
    self.is_a?(LauncherController) && current_game_id > 0
  end

  # spoof certain header values so hackers can't see info about our stack
  def set_headers
    response.headers["Server"] = "CGI (Borland C++/4.52/Windows 95)"
  end

  private
  def cache_other_db_connections
    PGModel.connection.cache { yield }
  end

end
