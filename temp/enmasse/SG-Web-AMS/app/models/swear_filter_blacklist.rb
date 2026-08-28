# == Schema Information
#
# Table name: swear_filter_blacklist
#
#  id                    :integer          not null, primary key
#  exact_match_words     :text
#  substring_match_words :text
#  reserved_words        :text
#  swear_mask            :string(255)      default("[filtered]")
#  created_at            :datetime
#  updated_at            :datetime
#

class SwearFilterBlacklist < ActiveRecord::Base
  self.table_name = "swear_filter_blacklist"

  attr_accessible :exact_match_words, :substring_match_words, :reserved_words, :swear_mask

  def self.create_default_for_test
    filter = SwearFilterBlacklist.new
    filter.exact_match_words = "ass, cum, dick, pecker, penis, tits, tit, titty, titties"

    str_substring = "/b/tard, $hit, $hitface, $hitty, $h1t, $h1tface, $h1tty, $lut, $lutbag, $pic, $p1c, a$$, a$$cash, a$$hole, a/$/$, anallick, analsex, assfuck, asshat, asshole, asspunk, "
    str_substring << "b1tch, bastard, bigdick, bitch, bitchtard, blowjob, bonefuck, boner, "
    str_substring << "chink, clit, cock, cockfag, cumface, cumguzzler, cumload, cumsucker, cunctqueen, cunt, cuntcicle, cuntlips, cuntpunch, cuntqueen, cuntsuck, "
    str_substring << "dickface, dickhead, dicknigger, dildo, dirtysanchez, donkeypunch, dumbshit, fu(k, fu(ked, fu(ker, fu(kface, fu(khole, fu(king, fu(ktard, fu(kwit, fag, " 
    str_substring << "fagget, faggot, fuck, fucked, fucker, fuckface, fuckhole, fucking, fucktard, fuckwit, fucock, furfag, gay, "
    str_substring << "hobag, jackass, jacka$$, jewfuck, kike, motherfuck, motherfucker, motherfucking, n1gg3r, n1gger, necrophiliac, nigga, nigg3r, nigger, niggerfag, pussy, pussyfaggot, pussyfart, pussyfuck, "
    str_substring << "pussylick, pussylips, queef, rimjob, sandnigger, sh1t, shit, shitbag, shitbrains, shitcock, shitter, shitface, shithead, shitstain, shittaco, shitty, shittyspic, "
    str_substring << "slutbag, spic, sp1c, twat, twatlips, vagina, whore, whorebag, whorebagcunt, yiff"
    filter.substring_match_words = str_substring

    filter.reserved_words = ""
    filter
  end
  
end
