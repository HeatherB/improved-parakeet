class TeraConsoleBetaSignupController < ApplicationController

	def index
		render "#{params[:page]}.html.erb"
	end

	def create
	    @tera_console_beta_signup = TeraConsoleBetaSignup.new(params[:tera_console_beta_signup])

	    if @tera_console_beta_signup.save
	      #TeraConsoleBetaSignupMailer.signup_alert(@tera_console_beta_signup).deliver_now
	      redirect_to "/consolebetasuccess", notice: "Thank you for signing up!."
	    else
	      puts @tera_console_beta_signup.errors.messages.map{|k,v| v}.flatten.join("<br/>".html_safe)
	      flash[:error] = @tera_console_beta_signup.errors.messages.map{|k,v| v}.flatten.join("<br/>".html_safe)
	      redirect_to "/consolebeta"
	    end
	end


	def new
	    @tera_console_beta_signup = TeraConsoleBetaSignup.new

	    #@page_data = page_parts("console_form")
	  end

	  private
	  def tera_console_beta_signup_params
	    params.require(:email).permit(:xbox, :ps4)
	  end


end
