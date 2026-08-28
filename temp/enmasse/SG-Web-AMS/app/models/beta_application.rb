class BetaApplication < ActiveRecord::Base
  attr_accessible :accepted_at, :applied_at, :game_id, :user_id, :game_account_id
  scope :live, -> { where("game_account_id IS NOT NULL") }
  scope :accepted, -> { where(game_account_id: nil).where("accepted_at IS NOT NULL") }
  scope :waitlist, -> { where(game_account_id: nil, accepted_at: nil,
                              blocked_at: nil, withdrawn_at: nil) }
  belongs_to :user

  def active?
    return self.withdrawn_at.nil? && self.blocked_at.nil?
  end

  def can_activate?
    return self.blocked_at.nil? && self.accepted_at.nil?
  end

  def accepted? 
    return active? && !self.accepted_at.nil?
  end

  def live?
    active? && self.game_account_id
  end

  def needs_game_account?
    return accepted? && self.game_account_id.nil?
  end

  def status
    if live?
      return "Live!"
    elsif accepted?
      return "Accepted"
    elsif active?
      return "Waitlist"
    elsif self.withdrawn_at
      return "Withdrawn"
    elsif self.blocked_at
      return "Banned"
    end
  end

  def self.full_info
    @games = Game.where(state: 0).all
    if @games.size < 1
      puts "No games in beta"
    else
      puts "#{@games.size} game#{'s' if @games.size > 1} in beta"
      puts "Game ID\tGame Name\tLive Accounts\tAccepted Accounts\tWaitlist Accounts"
      @games.each do |g|
        live_cnt = self.where(game_id: g.id).live.count
        accepted_cnt = self.where(game_id: g.id).accepted.count
        waitlist_cnt = self.where(game_id: g.id).waitlist.count
        puts "#{g.id}\t#{g.seo_id}\t\t#{live_cnt}\t\t#{accepted_cnt}\t\t#{waitlist_cnt}"
      end
    end
  end

  def self.accept(game_id, count, random = true)
    game = Game.where(state: 0, id: game_id).first
    if game && count.to_i > 0
      apps = self.where(game_id: game.id).waitlist.limit(count.to_i)
      if random
        apps.order("NEWID()")
      else
        apps.order(:accepted_at)
      end
      accept_time = Time.now
      apps = apps.update_all(accepted_at: accept_time)

      apps = BetaApplication.where(accepted_at: accept_time).all
      apps.each do |app|
        u = app.user
        EME::Email.send_email({master_account_id: u.id, email: u.email, 
                    template_name: "API_beta_accepted_#{game.seo_id}" })
      end
    else
      raise RuntimeError, "Requires proper game_id, and count > 0"
    end
  end

  def self.create_game_accounts(game_id, account_name, game_account_type_id = 1)
    game = Game.where(state: 0, id: game_id).first
    account_status_type ||= 1 # default to active

    if game
      apps_to_enable = self.where(game_id: game.id).accepted.all
      apps_to_enable.each do |app|
        ga = GameAccount.create(game_id: game.id, user_id: app.user_id, account_name: account_name,
                                game_account_type_id: game_account_type_id)
        app.game_account_id = ga.id
        app.save
      end
    else
      raise RuntimeError, "Requires proper game_id, game must be in beta"
    end
  end

end
