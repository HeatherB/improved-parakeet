class LauncherV2::UtilsController < ApplicationController

  def workflow
    render :text => LauncherV2WorkflowGenerator.getWorkflow
  end

  def workflow_direct3
    render :text => LauncherV2WorkflowGenerator.getWorkflowDirect3
  end

  def landing
    # sign-in with access_token
    render :json => {:success => true}
  end
end