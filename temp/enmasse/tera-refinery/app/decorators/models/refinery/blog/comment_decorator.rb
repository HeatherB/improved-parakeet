Refinery::Blog::Comment.class_eval do
  belongs_to :author

  delegate :name, :to => :author

  attr_accessible :author

  # XXX: Validations will fail without an email set on the object.
  before_validation(:on => :create) do
    self.email = "placeholder@example.com"
  end
end
