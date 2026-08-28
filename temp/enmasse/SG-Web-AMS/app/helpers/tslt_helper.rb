module TsltHelper
  # Looks up the translation in the current language.
  def tslt( string_id, replacements = nil )
    tslt_with_language(string_id, get_locale, replacements).html_safe
  end

  # a fairly ugly function that handles every possible situation you might run into
  def tslt_with_language(string_id, language, replacements = nil)
    if translations[string_id] # if string ID exists in translation
      if translations[string_id][language] # if language is in Translation
        if translations[string_id][language].empty? # if no translation yet for the target language

          # return English because the target language was blank.
          english_string = filter_placeholders( translations[string_id]["en"], replacements )

          unless english_string.blank?
            return Rails.env.development? ? Pseudolocalizer.munge( english_string ) : english_string
          end

        else
          # return the translation in the target language
          return filter_placeholders translations[string_id][language], replacements
        end
      end
    end

    "[#{string_id}]" # if we are totally missing the string, at least return the tag name
  end

  # takes the localized string and replaces replacements with real strings passed in
  # basically, a wrapper for String.gsub that takes a hash as an argument
  def filter_placeholders(string, replacements = {} )
    replacements = {} if replacements.nil?
    string       = string.to_s.dup
    replacements.each do |k,v|
     string.gsub! "{#{k.to_s}}", v.to_s
    end
    string
  end
  
  # Returns a multi-dimensional array of the current languages that may have translations.
  # Array is returned like:
  #
  # = Example
  # translated_languages
  # => [["fra", "French"], ["gre", "German"], ["ita", "Italian"]]
  def translated_languages
    return translations.keys.map { |k| translations[k].keys }.flatten.uniq.map do |lang_code| 
      [ lang_code, LANGUAGES_WITH_CODES[lang_code] ]
    end
  end

  # dump the current language to a json file for the layout
  def js_export
    filtered_export("JS")
  end

  # this returns only a set of keys where a column has been "checked". Right now it's only been used to get all the strings we need in JS, by putting an "x" in a column labeled JS in the gdoc.
  def filtered_export(filter_by)
    out = {}
    js_strings = translations.reject { |k,v| v[filter_by] == "" }
    js_strings.each_pair { |k,v| out[k] = v[get_locale] }
    out
  end

  def get_locale
    current_language#Tslt::Manager::settings[:get_current_language].call
  end

  # in case we change this elsewhere
  def translations
    TRANSLATIONS
  end
end