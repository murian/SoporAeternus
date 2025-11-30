# 🌑 HADES · PLUTON 🌑

## A Journey Through the Underworld

*An elaborate browser-based exploration game inspired by **Sopor Aeternus & the Ensemble of Shadows***

---

## 📖 Overview

**HADES · PLUTON** is a dark, atmospheric narrative exploration game where you play as **Anna-Varney Cantodea**, wandering through the intricate realms of the Greek underworld. Inspired by the melancholic beauty and gothic aesthetics of Sopor Aeternus, particularly the song "Hades - Pluton," this game immerses you in a world of shadows, death, and existential beauty.

### 🎭 Story

You stand at the threshold between life and death, drawn to the darkness by an inexplicable longing. As Anna-Varney Cantodea, you cross the River Styx and journey through multiple layers of the underworld:

- **The River Styx** - Where the living world dissolves
- **The Adamantine Gates** - Guarded by the three-headed Cerberus
- **The Asphodel Meadows** - Grey plains of forgotten souls
- **Tartarus** - The abyss of punishment and eternal suffering
- **Elysium** - Paradise for heroes and the blessed
- **The Palace of Hades** - Throne room of death's rulers

Your choices shape the narrative, leading to multiple possible endings.

---

## ✨ Features

### 🎮 Gameplay

- **Elaborate Exploration** - Navigate through interconnected underworld realms
- **Branching Dialogue** - Make meaningful choices that affect the story
- **Inventory System** - Collect mysterious items from the land of the dead
- **Journal/Memoir System** - Track your journey through shadow
- **Puzzle & Riddle Solving** - Challenge your wit against ancient guardians
- **Multiple Endings** - Your choices determine your fate

### 🎨 Aesthetic

- **Gothic CSS Design** - Dark, melancholic visuals inspired by Victorian mourning culture
- **Atmospheric Particle Effects** - Drifting souls and ethereal wisps
- **Dynamic Backgrounds** - Each location has unique visual atmosphere
- **Smooth Transitions** - Fade effects and animations enhance immersion
- **Responsive Design** - Works on desktop, tablet, and mobile

### 📊 Systems

- **Essence & Lucidity** - Two vital stats that track your condition
- **Save/Load** - Preserve your journey across sessions
- **Auto-Save** - Never lose progress
- **Achievement System** - Unlock milestones as you explore
- **Debug Console** - Developer tools for testing (see below)

---

## 🎯 How to Play

### Starting the Game

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
2. Click "Enter the Realm of Shadow" to begin
3. Read carefully and make your choices

### Controls

| Key | Action |
|-----|--------|
| **ESC** | Toggle menu |
| **I** | Focus inventory panel |
| **J** | Focus journal panel |
| **Mouse Click** | Interact with objects, select dialogue choices, navigate |

### Gameplay Tips

- **Read everything** - The story is rich with details and lore
- **Experiment with choices** - Different paths lead to different outcomes
- **Manage your stats** - Keep an eye on Essence and Lucidity
- **Collect items** - Some objects are necessary for progression
- **Save often** - Use the menu to preserve your progress
- **Talk to everyone** - NPCs have valuable information and items

---

## 🌟 Key Characters

- **Anna-Varney Cantodea** - You, the protagonist, walker between worlds
- **Charon** - The skeletal ferryman of the River Styx
- **Cerberus** - Three-headed guardian of the gates
- **Hades** - Lord of the Dead, King of the Underworld
- **Persephone** - Queen of the Underworld, both spring maiden and death goddess
- **Hecate** - Goddess of witchcraft and crossroads
- **Orpheus** - Legendary musician who once descended for love
- **The Furies** - Spirits of vengeance
- **Chronos** - The imprisoned Titan of Time
- **Wandering Shades** - Countless forgotten souls

---

## 🎵 Thematic Inspiration

This game draws heavily from:

- **Sopor Aeternus & the Ensemble of Shadows** - Musical and aesthetic inspiration
- **"Hades - Pluton"** - Primary song inspiration
- **Greek Mythology** - Classical underworld narratives
- **Gothic Literature** - Victorian death culture and melancholy
- **Existential Philosophy** - Themes of death, meaning, and beauty in darkness

### Recommended Listening

While playing, consider listening to:
- Sopor Aeternus - "Hades - Pluton"
- Sopor Aeternus - "The Inexperienced Spiral Traveller"
- Sopor Aeternus - "Dead Lovers' Sarabande"
- Sopor Aeternus - "Les Fleurs du Mal"

---

## 🛠 Technical Details

### Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Advanced styling with animations
- **Vanilla JavaScript (ES6+)** - Game engine and logic
- **LocalStorage API** - Save/load functionality
- **Web Audio API** - Placeholder for future audio implementation

### Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### File Structure

```
SoporAeternus/
├── index.html          # Main HTML structure
├── styles.css          # Gothic CSS styling
├── game-engine.js      # Core game engine
├── game-data.js        # Scenes, dialogue, and narrative
├── main.js             # Initialization and helpers
└── README.md           # This file
```

---

## 🔧 Developer Tools

Open the browser console (F12) to access debug commands:

```javascript
// Give yourself an item
debug.give('ancient_coins');

// Teleport to any scene
debug.teleport('throne_room');

// Modify stats
debug.setEssence(100);
debug.setSanity(50);

// View game state
debug.showFlags();
debug.showInventory();

// List all available scenes
debug.listScenes();

// View gameplay statistics
debug.stats();
```

### Available Scene IDs

- `river_styx`
- `ferry_crossing`
- `gates_of_hades`
- `asphodel_meadows`
- `tartarus_entrance`
- `tartarus_depths`
- `elysium_gates`
- `elysium_interior`
- `palace_approach`
- `throne_room`
- `return_journey`
- `ending_return`
- `eternal_ending`

---

## 🏆 Achievements

Unlock these milestones:

- **First Step into Shadow** - Enter the underworld
- **Ferry's Passenger** - Speak with Charon
- **Riddlemaster** - Solve all three riddles of Cerberus
- **Audience with Death** - Stand before Hades and Persephone
- **Eternal Dweller** - Choose to remain in the underworld
- **Walker Between Worlds** - Return to the living world
- **Embraced the Void** - Choose the path of darkness
- **Fire Within** - Drink from the River of Fire
- **Touched by Madness** - Reach critically low sanity
- **Cartographer of the Dead** - Visit every location

---

## 🎬 Endings

The game features multiple endings based on your choices:

1. **Return to Life** - Journey back to the living world, changed forever
2. **Eternal Dwelling** - Choose to remain in the underworld as an immortal shade
3. **Game Over (Essence)** - Your essence fades completely
4. **Game Over (Sanity)** - Your mind dissolves into madness

---

## 🎨 Customization

### Adding New Content

The game is designed to be easily extensible. To add new scenes:

1. Edit `game-data.js`
2. Add a new scene object following the existing pattern
3. Link it to other scenes via the `exits` array

Example:

```javascript
my_new_scene: {
    title: 'My New Location',
    depth: 'A New Veil',
    background: 'custom-bg',
    description: `<p>Your description here...</p>`,
    objects: [...],
    exits: [...]
}
```

### Styling

All visual styling is in `styles.css`. Key CSS variables:

```css
--color-glow: #6a4c93;
--color-bone: #e8dcc4;
--font-title: 'Cinzel', serif;
--font-gothic: 'UnifrakturMaguntia', cursive;
```

---

## 📝 Credits

### Created By

This game was created as an homage to the dark, melancholic artistry of **Sopor Aeternus & the Ensemble of Shadows**.

### Inspirations

- **Anna-Varney Cantodea** - Musical artist and aesthetic inspiration
- **Greek Mythology** - Classical underworld narratives
- **Gothic Literature** - Death, beauty, and darkness

### Fonts

- **Cinzel** - Google Fonts (Titles)
- **UnifrakturMaguntia** - Google Fonts (Gothic titles)
- **Crimson Text** - Google Fonts (Body text)

---

## 📜 License

This is a fan-created artistic project inspired by Sopor Aeternus. All references to Sopor Aeternus, Anna-Varney Cantodea, and their music are made with respect and admiration.

The code is provided as-is for educational and artistic purposes.

---

## 🌙 Final Notes

*"In the shadows, we find beauty. In death, we find meaning. In the underworld, we find ourselves."*

This game is a meditation on death, melancholy, and the beauty that exists in darkness. It's meant to be experienced slowly, with attention to atmosphere and narrative.

May your journey through Hades bring you understanding, and may the shadows embrace you gently.

---

**Version:** 1.0.0
**Last Updated:** 2025
**Status:** Complete

*Walk in shadow, Anna-Varney. The underworld awaits...*

🖤⚰️🌑
