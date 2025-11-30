/**
 * HADES · PLUTON - Main Initialization
 * Entry point for the game
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║               HADES · PLUTON                              ║
║        A Journey Through the Underworld                   ║
║                                                           ║
║    Inspired by Sopor Aeternus & the Ensemble of Shadows  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);

    // Initialize the game engine with scene data
    game.init(GAME_SCENES);

    // Check for existing save
    const hasSave = localStorage.getItem('hades_pluton_save') ||
                   localStorage.getItem('hades_pluton_autosave');

    if (hasSave) {
        console.log('Previous journey detected...');
    }

    // Add keyboard hint
    console.log(`
Keyboard Controls:
------------------
ESC     - Toggle menu
I       - Focus inventory
J       - Focus journal
    `);

    // Add atmospheric ambient sound effect simulation (visual feedback)
    addAtmosphericEffects();

    // Initialize tooltips
    initializeTooltips();

    // Add visual feedback for low stats
    monitorStats();

    // Easter egg console commands
    window.debug = {
        give: (itemId) => {
            game.addToInventory({
                id: itemId,
                name: itemId,
                icon: '✦',
                description: 'Debug item'
            });
        },
        teleport: (sceneId) => {
            game.loadScene(sceneId);
        },
        setEssence: (value) => {
            game.state.stats.essence = value;
            game.updateUI();
        },
        setSanity: (value) => {
            game.state.stats.sanity = value;
            game.updateUI();
        },
        showFlags: () => {
            console.table(game.state.flags);
        },
        showInventory: () => {
            console.table(game.state.inventory);
        },
        listScenes: () => {
            console.log('Available scenes:', Object.keys(GAME_SCENES));
        }
    };

    console.log('Debug commands available: window.debug');
    console.log('Example: debug.teleport("throne_room")');
});

/**
 * Add atmospheric visual effects
 */
function addAtmosphericEffects() {
    // Add screen edge vignette
    const vignette = document.createElement('div');
    vignette.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 5;
        box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8);
    `;
    document.body.appendChild(vignette);

    // Add occasional screen flicker effect
    setInterval(() => {
        if (Math.random() < 0.05) { // 5% chance every interval
            vignette.style.animation = 'flicker 0.1s';
            setTimeout(() => {
                vignette.style.animation = '';
            }, 100);
        }
    }, 3000);

    // Add CSS for flicker
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize tooltips for inventory items
 */
function initializeTooltips() {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(26, 15, 31, 0.95);
        border: 1px solid #6a4c93;
        color: #e8dcc4;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
        max-width: 250px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.8);
    `;
    document.body.appendChild(tooltip);

    // Add tooltip functionality
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[title]');
        if (target && target.title) {
            tooltip.textContent = target.title;
            tooltip.style.opacity = '1';
            updateTooltipPosition(e);
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (tooltip.style.opacity === '1') {
            updateTooltipPosition(e);
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[title]');
        if (target) {
            tooltip.style.opacity = '0';
        }
    });

    function updateTooltipPosition(e) {
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
    }
}

/**
 * Monitor stats and add visual feedback
 */
function monitorStats() {
    setInterval(() => {
        const essenceValue = document.getElementById('essence-value');
        const sanityValue = document.getElementById('sanity-value');
        const essence = game.state.stats.essence;
        const sanity = game.state.stats.sanity;

        // Change color based on value
        if (essence <= 25) {
            essenceValue.style.color = '#d32f2f';
            essenceValue.style.animation = 'pulse 1s infinite';
        } else if (essence <= 50) {
            essenceValue.style.color = '#ff9800';
            essenceValue.style.animation = '';
        } else {
            essenceValue.style.color = '#9d7bb8';
            essenceValue.style.animation = '';
        }

        if (sanity <= 25) {
            sanityValue.style.color = '#d32f2f';
            sanityValue.style.animation = 'pulse 1s infinite';
            // Add screen distortion effect
            if (sanity <= 15) {
                addDistortionEffect();
            }
        } else if (sanity <= 50) {
            sanityValue.style.color = '#ff9800';
            sanityValue.style.animation = '';
        } else {
            sanityValue.style.color = '#9d7bb8';
            sanityValue.style.animation = '';
        }
    }, 1000);

    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Add screen distortion when sanity is very low
 */
function addDistortionEffect() {
    const bg = document.getElementById('scene-background');
    if (bg && !bg.classList.contains('distorted')) {
        bg.classList.add('distorted');
        bg.style.animation = 'distort 2s ease-in-out';

        setTimeout(() => {
            bg.classList.remove('distorted');
            bg.style.animation = '';
        }, 2000);
    }
}

// Add distortion animation
const distortionStyle = document.createElement('style');
distortionStyle.textContent = `
    @keyframes distort {
        0%, 100% {
            transform: translateX(0);
            filter: hue-rotate(0deg);
        }
        25% {
            transform: translateX(-5px);
            filter: hue-rotate(10deg);
        }
        75% {
            transform: translateX(5px);
            filter: hue-rotate(-10deg);
        }
    }
`;
document.head.appendChild(distortionStyle);

/**
 * Add custom console styling for game messages
 */
const consoleStyles = {
    title: 'color: #9d7bb8; font-size: 16px; font-weight: bold;',
    info: 'color: #e8dcc4; font-size: 12px;',
    warning: 'color: #ff9800; font-size: 12px;',
    error: 'color: #d32f2f; font-size: 12px; font-weight: bold;'
};

// Override console methods for themed output
const originalLog = console.log;
console.gameLog = function(message, type = 'info') {
    originalLog(`%c${message}`, consoleStyles[type] || consoleStyles.info);
};

/**
 * Performance optimization: Lazy load heavy animations
 */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

// Observe elements for lazy animation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scene-object, .navigation-option').forEach(el => {
        observer.observe(el);
    });
});

/**
 * Add ambient audio references (placeholders for future implementation)
 */
const AUDIO_TRACKS = {
    menu: 'ambient_menu.mp3',
    river_styx: 'river_ambience.mp3',
    tartarus: 'tartarus_screams.mp3',
    elysium: 'elysian_peace.mp3',
    throne_room: 'throne_majesty.mp3',

    // Sound effects
    sfx_dialogue: 'dialogue_appear.mp3',
    sfx_item: 'item_pickup.mp3',
    sfx_navigate: 'navigate.mp3',
    sfx_choice: 'choice_select.mp3'
};

/**
 * Web Audio API Placeholder
 * Can be extended to add actual audio
 */
class AudioManager {
    constructor() {
        this.context = null;
        this.tracks = {};
        this.enabled = false;
    }

    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.enabled = true;
            console.gameLog('Audio system initialized', 'info');
        } catch (e) {
            console.gameLog('Audio not supported', 'warning');
        }
    }

    play(trackName) {
        if (!this.enabled) return;
        console.gameLog(`Playing: ${trackName}`, 'info');
        // Actual implementation would load and play audio files
    }

    stop(trackName) {
        if (!this.enabled) return;
        console.gameLog(`Stopping: ${trackName}`, 'info');
    }
}

const audioManager = new AudioManager();

/**
 * Add settings management
 */
const Settings = {
    textSpeed: 'normal', // slow, normal, fast
    particles: true,
    screenShake: true,
    autoSave: true,

    load() {
        try {
            const saved = localStorage.getItem('hades_pluton_settings');
            if (saved) {
                Object.assign(this, JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    },

    save() {
        try {
            localStorage.setItem('hades_pluton_settings', JSON.stringify(this));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }
};

Settings.load();

/**
 * Extend game with additional helper methods
 */
game.playSound = function(soundName) {
    audioManager.play(AUDIO_TRACKS[soundName] || soundName);
};

game.shake = function(intensity = 'medium') {
    if (!Settings.screenShake) return;

    const gameScreen = document.getElementById('game-screen');
    gameScreen.style.animation = `shake-${intensity} 0.5s`;
    setTimeout(() => {
        gameScreen.style.animation = '';
    }, 500);
};

// Add shake animations
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake-light {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }
    @keyframes shake-medium {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    @keyframes shake-heavy {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-10px, -5px); }
        20% { transform: translate(10px, 5px); }
        30% { transform: translate(-10px, 5px); }
        40% { transform: translate(10px, -5px); }
        50% { transform: translate(-10px, -5px); }
        60% { transform: translate(10px, 5px); }
        70% { transform: translate(-10px, 5px); }
        80% { transform: translate(10px, -5px); }
        90% { transform: translate(-10px, -5px); }
    }
`;
document.head.appendChild(shakeStyle);

/**
 * Add typed text effect for dramatic moments
 */
game.typeText = function(element, text, speed = 50) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }

    if (!element) return;

    element.textContent = '';
    let index = 0;

    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, speed);
};

/**
 * Achievement/Milestone system
 */
const Achievements = {
    list: {
        first_death: { name: 'First Step into Shadow', description: 'Enter the underworld for the first time' },
        talked_to_charon: { name: 'Ferry\'s Passenger', description: 'Speak with Charon' },
        solved_riddles: { name: 'Riddlemaster', description: 'Solve all three riddles of Cerberus' },
        reached_hades: { name: 'Audience with Death', description: 'Stand before Hades and Persephone' },
        stayed_forever: { name: 'Eternal Dweller', description: 'Choose to remain in the underworld' },
        returned_alive: { name: 'Walker Between Worlds', description: 'Return to the living world' },
        touched_darkness: { name: 'Embraced the Void', description: 'Choose the path of darkness' },
        drank_phlegethon: { name: 'Fire Within', description: 'Drink from the River of Fire' },
        low_sanity: { name: 'Touched by Madness', description: 'Reach critically low sanity' },
        explored_all: { name: 'Cartographer of the Dead', description: 'Visit every location' }
    },

    unlocked: {},

    unlock(achievementId) {
        if (!this.unlocked[achievementId] && this.list[achievementId]) {
            this.unlocked[achievementId] = true;
            const achievement = this.list[achievementId];
            game.showNotification(`Achievement Unlocked: ${achievement.name}`);
            console.gameLog(`🏆 ${achievement.name}: ${achievement.description}`, 'title');
            this.save();
        }
    },

    save() {
        try {
            localStorage.setItem('hades_pluton_achievements', JSON.stringify(this.unlocked));
        } catch (e) {
            console.error('Failed to save achievements:', e);
        }
    },

    load() {
        try {
            const saved = localStorage.getItem('hades_pluton_achievements');
            if (saved) {
                this.unlocked = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load achievements:', e);
        }
    }
};

Achievements.load();
game.achievements = Achievements;

/**
 * Analytics/Telemetry (Privacy-respecting, local only)
 */
const Analytics = {
    stats: {
        playtime: 0,
        deaths: 0,
        choices_made: 0,
        scenes_visited: 0,
        items_collected: 0
    },

    startTime: null,

    start() {
        this.startTime = Date.now();
        this.load();
        this.updatePlaytime();
    },

    updatePlaytime() {
        setInterval(() => {
            if (this.startTime) {
                this.stats.playtime = Math.floor((Date.now() - this.startTime) / 1000);
                this.save();
            }
        }, 60000); // Update every minute
    },

    track(event) {
        if (this.stats[event] !== undefined) {
            this.stats[event]++;
            this.save();
        }
    },

    save() {
        try {
            localStorage.setItem('hades_pluton_analytics', JSON.stringify(this.stats));
        } catch (e) {
            console.error('Failed to save analytics:', e);
        }
    },

    load() {
        try {
            const saved = localStorage.getItem('hades_pluton_analytics');
            if (saved) {
                this.stats = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load analytics:', e);
        }
    },

    display() {
        console.table(this.stats);
    }
};

Analytics.start();
window.debug.stats = () => Analytics.display();

/**
 * Final initialization message
 */
console.log('%c🌑 Welcome to the Underworld 🌑', 'font-size: 20px; color: #9d7bb8; font-weight: bold;');
console.log('%cYou are Anna-Varney Cantodea...', 'font-size: 14px; color: #e8dcc4; font-style: italic;');
console.log('%cYour journey begins at the River Styx...', 'font-size: 14px; color: #e8dcc4; font-style: italic;');
