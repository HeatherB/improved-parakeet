# Gaming E-Commerce Platform

**En Masse Entertainment** | Senior Front-End Developer | 2015–2019

Built and maintained multi-game web storefronts, purchase flows, virtual currency systems, and game launchers for a video game publisher with titles including TERA, Closers, Kritika Online, and PUBG.

---

## The Challenge

En Masse Entertainment published multiple free-to-play games, each with its own storefront, virtual currency needs, and promotional cycles. The platform required:

- A **unified store architecture** that could serve multiple games from one codebase
- **Secure payment processing** with international support (US, EU, South America)
- **Real-time inventory** synced with in-game delivery systems
- **Seasonal promotional features** like holiday gifting with tiered rewards
- **Console launcher UI** for Xbox One and PlayStation 4 releases

![En Masse Store Homepage](placeholder-enmasse-store-home.png)
*Multi-game storefront with dynamic theming per title*

---

## Technical Architecture

### Multi-Game Storefront (Ruby/Sinatra)

The store was built as a thin client in **Ruby/Sinatra** that could dynamically theme itself based on the active game context. Each game (TERA, Closers, Kritika) shared the same purchase flow logic but had distinct visual identities.

```ruby
# Route handling for game-specific storefronts
get '/:game/items' do
  @game = params[:game]
  @items = GameStore.items_for(@game)
  erb :items, layout: :"layouts/#{@game}"
end
```

**Key architectural decisions:**
- **Shared business logic** — One codebase for cart, checkout, inventory
- **Game-specific theming** — CSS variables and layout templates per title
- **SSO integration** — Single sign-on with En Masse account system

### 4-Step Secure Checkout Flow

Designed and implemented a conversion-optimized purchase flow:

1. **Choose Products** — Cart management with real-time pricing
2. **Review Order** — Tax calculation based on billing location
3. **Enter Payment Details** — Integration with Xsolla, Steam, Payletter
4. **View Receipt** — Order confirmation with email delivery

![Purchase Flow](placeholder-purchase-flow.png)
*Step 2: Order review with dynamic tax calculation*

```erb
<div class="purchase-tracker">
  <ul>
    <li class="num lightup"><span>1</span>Choose Products</li>
    <li class="arrow lightup">&rarr;</li>
    <li class="num lightup"><span>2</span>Review Order</li>
    <li class="arrow">&rarr;</li>
    <li class="num"><span>3</span>Enter Payment Details</li>
    <li class="arrow">&rarr;</li>
    <li class="num"><span>4</span>View Receipt</li>
  </ul>
</div>
```

### Virtual Currency System (EMP)

En Masse Points (EMP) served as the universal virtual currency across all titles. Users could purchase EMP bundles and spend them on:

- Character customization (costumes, mounts, weapon skins)
- Convenience items (XP boosts, inventory expansions)
- Elite Status subscriptions (premium membership)

The system handled:
- **Multiple payment providers** — Credit card, PayPal, Steam Wallet, regional options
- **Promotional pricing** — Bonus EMP on larger purchases
- **Subscription management** — Recurring billing for Elite Status

---

## Console Launcher (Xbox One / PlayStation 4)

When TERA launched on consoles, I built the **in-game launcher menu** — the UI players see after launching the game but before entering gameplay. This required:

### Character-Aware Welcome Screen

The launcher pulled player data via SSO and displayed personalized content:

```ruby
@character = {
  "name" => "Captain.Placeholder",
  "race" => "Elin",
  "class" => params[:class],
  "level" => params[:level],
  "server_id" => 4025
}
```

### Class-Specific Guides

Created 13 class-specific tip panels that adjusted content based on player level:

| Class | Level 1-29 Content | Level 30+ Content |
|-------|-------------------|-------------------|
| Archer | Core skills (Backstep, Radiant Arrow) | Crystal builds for PvE/PvP |
| Berserker | Combo fundamentals | Endgame gear optimization |
| Lancer | Tanking basics | Aggro management advanced |

![Launcher Class Tips](placeholder-launcher-class.png)
*Level-aware class guides surfaced contextual tips based on character progression*

---

## Holiday Gifting System

Built a seasonal gifting feature that drove player engagement and revenue during holiday periods. Players could:

1. **Purchase gift boxes** from the store
2. **Send boxes to friends** via the gifting center
3. **Earn tiered rewards** based on generosity

### Reward Tiers (Wintera 2018 Example)

| Gifts Sent | Reward |
|------------|--------|
| 1 | Permanent cosmetic accessory |
| 3 | 30-day Elite Status voucher |
| 5 | Fiery Halo accessory |
| 10 | Account-bound pet (72 inventory slots) |
| 15 | Ultraplasm weapon skin |

```erb
<div class="reminder">
  <h3>Last chance to purchase golden gift boxes!</h3>
  <div id="countdown">
    <div class="timer" id="hours">54</div>
    <div class="timer" id="minutes">5</div>
    <div class="timer" id="seconds">12</div>
  </div>
</div>
```

The gifting center included:
- **Countdown timers** for promotional deadlines
- **Friend selection UI** with game account validation
- **Progress tracking** toward reward tiers

![Gifting Center](placeholder-gifting-center.png)
*Holiday gifting interface with countdown and reward progress*

---

## Deployment & Infrastructure

### Docker Migration

Led migration from Jenkins/Capistrano to **Docker-based deployment**:

- **Containerized services** — Store, authentication, game websites
- **Consistent environments** — Dev/staging/production parity
- **Faster deployments** — Reduced release cycle time

### Multi-Region Support

The platform served players across:
- North America (primary market)
- Europe (localized storefronts)
- South America (regional payment options)

Localization involved:
- Currency display (USD, EUR, BRL)
- Payment provider availability per region
- Promotional content scheduling across time zones

---

## Results & Impact

| Metric | Outcome |
|--------|---------|
| **Games Supported** | 5 titles (TERA, Closers, Kritika, ZMR, AVA) |
| **Console Launch** | TERA on Xbox One + PS4 with custom launcher |
| **Payment Providers** | 4+ integrations (Xsolla, Steam, Payletter, credit card) |
| **Holiday Campaigns** | Annual gifting events with tiered engagement rewards |

---

## Skills Demonstrated

- **Full-stack e-commerce** — Ruby/Sinatra, payment APIs, secure checkout
- **Multi-platform UI** — Web stores, console launchers, in-game interfaces
- **System integration** — SSO, game servers, inventory delivery
- **Promotional systems** — Time-limited campaigns, reward mechanics
- **Docker/DevOps** — Containerization, CI/CD pipelines

---

## Relevance to Cloud AI / UX Engineering

This project demonstrates:

1. **Platform architecture** — Building systems that scale across multiple products
2. **User-facing complexity** — Purchase flows, gifting, and launchers all required intuitive UX despite complex backend systems
3. **Real-time integration** — SSO, inventory, and payment systems needed to work seamlessly
4. **International scale** — Multi-region deployment with localization

These skills directly apply to building AI-powered tools and platforms where the challenge is making sophisticated backend capabilities accessible through thoughtful, reliable interfaces.
