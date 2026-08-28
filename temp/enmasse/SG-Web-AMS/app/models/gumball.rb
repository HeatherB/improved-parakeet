class Gumball < PGModel
  belongs_to :gumballable, polymorphic: true
end
