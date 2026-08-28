class LauncherGame < PGModel
  has_many :launcher_gumballs, as: :gumballable
  has_many :launcher_game_options
  has_many :launcher_game_languages

  def sorted_gumballs
    self.launcher_gumballs.where(active: true).order(:position).all
  end

  def game_options
    self.launcher_game_options.where(active: true).order(:position).all
  end

  def languages
    self.launcher_game_languages.where(active: true).order(:position).all
  end

  def as_json(options = {})
    json = super(options)
    json[:gumballs] = self.sorted_gumballs.as_json(options)
    json[:game_options] = self.game_options.as_json(options)
    json[:languages] = self.languages.as_json(options)
    return json
  end
end
