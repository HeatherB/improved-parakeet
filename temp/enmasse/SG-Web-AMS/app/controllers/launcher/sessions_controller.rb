class Launcher::SessionsController < LauncherController
  include Extensions::SessionsControllerEx

  before_filter :launcher_force_logout, :only => [:new, :create]
  before_filter :set_global_alerts, :only => [:new]
  skip_after_filter :mark_user_active, :only => [:keepalive]
  skip_before_filter :verify_authenticity_token, :only => [:new, :create]
  skip_before_filter :check_game_maintenance, :only => [:login_form, :keepalive]

  # exclude :set_game filter for :keepalive since it incurs unnecessary database queries.
  # because a game object can be shared by lots of users, locking for the game object may incurs lots of lock conflicts.
  skip_before_filter :set_game, :only => [:keepalive]

  def create
    create_handler(
      launcher_signin_path,
      launcher_signin_path,
      launcher_path(@game)
    )
  end

  def new
    render "launcher/sessions/#{@game.name.downcase}/new"
  end

  # associate third party user id (for example steam) with master account id
  def associate
    if !logged_in?
      render :json => {:error => "not logged in"}.to_json
    else
      if params[:provider] == "steam"
        if params[:steam_auth_ticket] && params[:steam_app_id]
          error_msg = current_user.associate_with_steam(params[:steam_app_id], params[:steam_auth_ticket])
          if error_msg.nil?
            render :json => {:success => 'success'}.to_json
          else
            render :json => {:error => error_msg}.to_json
          end
        else
          render :json => {:error => 'missing steam_auth_ticket'}.to_json
        end
      else
        render :json => {:error => 'undefined provider'}.to_json
      end
    end
  end

  # this returns javascript to replace the launcher loading icon w/ the
  # AMS hosted login form (launcher/1/signin)
  # Must set the access control header otherwise the ajax call will fail
  # due to cross-domain issues.
  def login_form
    session[:game] = @game.name.downcase if @game
    headers['Access-Control-Allow-Origin'] = '*';
    render :layout => false
  end

  def keepalive
    headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    headers["Pragma"] = "no-cache"
    render :nothing => true, :status => 200
  end

  protected

  def set_global_alerts
    @global_alerts = GlobalAlert.for_path(request.path, params[:id])
  end

  private

  def launcher_force_logout
    logout_user if logged_in? && in_launcher?
  end
end
