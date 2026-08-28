# Pokémon Launch Sites — International Localization at Scale

**Plexipixel** | Front-End Developer | 2014–2015

Built promotional websites for Nintendo's Pokémon franchise, delivering fully localized experiences across 14 languages. Also developed campaign sites for Sierra Nevada Brewing Company.

---

## The Challenge

Nintendo needed promotional websites for **Pokémon Rumble World** and **Pokémon Shuffle** launches that could serve global audiences. Requirements included:

- **14-language localization** — Not just text, but images, layouts, and regional content
- **Simultaneous global launch** — All language versions live at once
- **Brand compliance** — Strict adherence to Pokémon visual standards
- **Responsive design** — Desktop, tablet, mobile across all markets

![Pokémon Rumble World](placeholder-pokemon-rumble.png)
*Pokémon Rumble World launch site — shown in English, with language selector in footer*

---

## Technical Architecture

### .NET with RESX Localization

The sites were built on **.NET** with a robust localization architecture using **RESX resource files**. Each language maintained its own resource file containing all translatable content.

```xml
<!-- Resources.en-US.resx -->
<data name="hero_headline" xml:space="preserve">
  <value>Collect Toy Pokémon!</value>
</data>
<data name="hero_subhead" xml:space="preserve">
  <value>Battle your way through a world of adventure</value>
</data>

<!-- Resources.ja-JP.resx -->
<data name="hero_headline" xml:space="preserve">
  <value>おもちゃのポケモンを集めよう！</value>
</data>
```

### Languages Supported

| Region | Languages |
|--------|-----------|
| Americas | English (US), Spanish (Latin America), Portuguese (Brazil) |
| Europe | English (UK), French, German, Spanish (Spain), Italian, Dutch |
| Asia-Pacific | Japanese, Korean, Traditional Chinese |
| Additional | Russian, Polish |

### Image Localization

Beyond text, many assets required localization:
- **Hero images** with embedded text
- **Button graphics** with call-to-action text
- **Screenshots** showing localized in-game UI
- **Legal disclaimers** per region

```xml
<!-- Localized image paths -->
<data name="hero_image" xml:space="preserve">
  <value>/assets/img/hero/hero-en-US.png</value>
</data>
```

---

## CSS Architecture — Themeable Foundation

We developed a **three-layer CSS architecture** that enabled rapid skinning:

### Layer 1: Bootstrap Foundation
Base grid and responsive utilities from Bootstrap 3.

### Layer 2: Internal Structure
Custom component styles decoupled from visual theming:

```scss
// _structure.scss
.hero-section {
  display: flex;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
```

### Layer 3: Brand Theme
Visual skin specific to the campaign:

```scss
// _theme-rumble.scss
:root {
  --brand-primary: #FFCB05;    // Pokémon Yellow
  --brand-secondary: #3D7DCA;  // Pokémon Blue
  --brand-accent: #FF0000;     // Poké Ball Red
}

.hero-section {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
}
```

This architecture meant we could **reskin for different campaigns** (Rumble vs. Shuffle) while maintaining the same underlying codebase.

![Pokémon Shuffle](placeholder-pokemon-shuffle.png)
*Pokémon Shuffle used the same codebase with different theme layer*

---

## Language Switching UX

Users could switch languages via a dropdown in the footer. The implementation:

1. **Detected browser locale** on initial visit
2. **Stored preference** in cookie for return visits
3. **Allowed manual override** via footer selector
4. **Preserved page state** during language switch (no reload)

```javascript
// Language switch without full page reload
function switchLanguage(locale) {
  document.cookie = `locale=${locale};path=/;max-age=31536000`;
  loadResources(locale).then(updatePageContent);
}
```

---

## Sierra Nevada Campaign Sites

Also developed promotional sites for **Sierra Nevada Brewing Company**:

### Beer Camp Across America
Multi-city beer festival tour site featuring:
- **City-specific content** — Local brewery partners, venue info
- **Event schedules** — Date/time with timezone handling
- **Ticket integration** — Links to purchase platforms
- **Photo galleries** — User-submitted and professional photography

![Sierra Nevada Beer Camp](placeholder-sierra-beercamp.png)
*Beer Camp Across America — responsive festival site*

### Sierra Selfie
Photo contest campaign with:
- **User submissions** — Photo upload with moderation queue
- **Voting mechanism** — Community engagement
- **Prize integration** — Winner selection and notification

---

## Microsoft Build Tour Emails

Created email templates for **Microsoft Build Tour** — a developer conference series across 23 global cities. Each city required:

- **Unique header graphics** featuring local landmarks
- **Localized date/time** formatting
- **Regional speaker lineups**
- **City-specific venue information**

```html
<!-- Template with city variable injection -->
<table class="header">
  <tr>
    <td>
      <img src="{{city_hero_image}}" alt="Build Tour {{city_name}}">
    </td>
  </tr>
  <tr>
    <td>
      <h1>Microsoft Build Tour — {{city_name}}</h1>
      <p>{{event_date}} | {{venue_name}}</p>
    </td>
  </tr>
</table>
```

![Microsoft Build Email](placeholder-build-email.png)
*Build Tour email template with city-specific customization*

---

## Results & Impact

| Metric | Outcome |
|--------|---------|
| **Languages Delivered** | 14 simultaneous localizations |
| **Launch Timing** | Global simultaneous release |
| **Platform Support** | Desktop, tablet, mobile responsive |
| **Reusability** | Same codebase for Rumble + Shuffle launches |
| **Build Tour Cities** | 23 city-specific email templates |

---

## Skills Demonstrated

- **International localization** — RESX resource files, right-to-left considerations, image localization
- **Themeable architecture** — CSS layering for rapid reskinning
- **Brand compliance** — Working within strict visual guidelines (Nintendo, Microsoft)
- **Responsive design** — Mobile-first across global markets
- **Email development** — Cross-client compatibility, template systems

---

## Relevance to Cloud AI / UX Engineering

This project demonstrates:

1. **Scale through architecture** — 14 languages from one codebase requires thoughtful separation of content and presentation
2. **Global user experience** — Localization goes beyond translation; it's about cultural adaptation
3. **Brand partnership** — Working with major brands (Nintendo, Microsoft) requires precision and compliance
4. **Reusable systems** — The CSS architecture enabled rapid campaign deployment

These principles apply directly to building AI tools for global audiences, where the interface must adapt to different languages, regions, and user contexts while maintaining consistency and brand integrity.
