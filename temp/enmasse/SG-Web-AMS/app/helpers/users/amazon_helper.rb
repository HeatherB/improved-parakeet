module Users::AmazonHelper
  include UsersHelper

  def error_messages_for_form_step
    @form ||= 'form_1'
    fields = Users::AmazonController::FORM_FIELDS[@form]
    errors = {}
    fields.each do |field|
      unless @user.errors[field].empty?
        errors[field] = @user.errors[field]
      end
    end
    errors.delete_if{ |k,v| v.compact!; v.blank? }
    error_messages = []
    errors.each do |field, errors|
      error_messages << "#{field.to_s.humanize.capitalize} #{errors.join(' and ')}."
    end
    error_messages
  end
end
