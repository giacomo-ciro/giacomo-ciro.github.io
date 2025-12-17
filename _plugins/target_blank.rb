module Jekyll
  module TargetBlank
    def target_blank(html)
      html.gsub(/<a /, '<a target="_blank" rel="noopener noreferrer" ')
    end
  end
end

Liquid::Template.register_filter(Jekyll::TargetBlank)
