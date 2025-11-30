/**
 * HADES · PLUTON - Game Engine
 * A sophisticated game engine for browser-based exploration
 * Inspired by Sopor Aeternus & the Ensemble of Shadows
 */

class GameEngine {
    constructor() {
        this.state = {
            currentScene: null,
            inventory: [],
            journal: [],
            flags: {},
            stats: {
                essence: 100,
                sanity: 100,
                depth: 'The First Veil'
            },
            visitedScenes: [],
            choices: {}
        };

        this.scenes = {};
        this.audioEnabled = true;
        this.particles = [];
        this.eventHandlers = {};
    }

    /**
     * Initialize the game engine
     */
    init(sceneData) {
        this.scenes = sceneData;
        this.setupEventListeners();
        this.initializeAudio();
        this.loadGame();
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Menu buttons
        document.getElementById('start-button')?.addEventListener('click', () => this.startGame());
        document.getElementById('menu-continue')?.addEventListener('click', () => this.hideMenu());
        document.getElementById('menu-save')?.addEventListener('click', () => this.saveGame());
        document.getElementById('menu-load')?.addEventListener('click', () => this.loadGame());
        document.getElementById('menu-restart')?.addEventListener('click', () => this.restartGame());
        document.getElementById('audio-toggle')?.addEventListener('click', () => this.toggleAudio());
        document.getElementById('interaction-close')?.addEventListener('click', () => this.closeInteraction());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.toggleMenu();
            if (e.key === 'i' || e.key === 'I') this.focusInventory();
            if (e.key === 'j' || e.key === 'J') this.focusJournal();
        });
    }

    /**
     * Start the game
     */
    startGame() {
        document.getElementById('start-screen').classList.add('fade-out');
        setTimeout(() => {
            document.getElementById('start-screen').style.display = 'none';
            this.loadScene('river_styx');
            this.startParticleSystem();
        }, 1000);
    }

    /**
     * Load a scene
     */
    loadScene(sceneId) {
        const scene = this.scenes[sceneId];
        if (!scene) {
            console.error(`Scene ${sceneId} not found`);
            return;
        }

        this.state.currentScene = sceneId;

        // Mark as visited
        if (!this.state.visitedScenes.includes(sceneId)) {
            this.state.visitedScenes.push(sceneId);
        }

        // Update depth if specified
        if (scene.depth) {
            this.state.stats.depth = scene.depth;
        }

        // Render scene
        this.renderScene(scene);

        // Execute scene entry effects
        if (scene.onEnter) {
            scene.onEnter(this);
        }

        // Auto-save
        this.autoSave();
    }

    /**
     * Render the current scene
     */
    renderScene(scene) {
        // Update background
        const bg = document.getElementById('scene-background');
        bg.className = `scene-bg ${scene.background || 'default-bg'}`;

        // Update title
        const title = document.getElementById('scene-title');
        title.textContent = scene.title;
        title.className = 'scene-title fade-in';

        // Update description
        const desc = document.getElementById('scene-description');
        desc.innerHTML = this.processText(scene.description);
        desc.className = 'scene-description fade-in';

        // Render objects
        this.renderObjects(scene.objects || []);

        // Render navigation
        this.renderNavigation(scene.exits || []);

        // Update UI
        this.updateUI();

        // Show dialogue if present
        if (scene.dialogue) {
            this.showDialogue(scene.dialogue);
        }
    }

    /**
     * Process text with variable replacement
     */
    processText(text) {
        if (typeof text === 'function') {
            text = text(this.state);
        }
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return this.state.flags[key] || match;
        });
    }

    /**
     * Render interactive objects
     */
    renderObjects(objects) {
        const container = document.getElementById('scene-objects');
        container.innerHTML = '';

        objects.forEach((obj, index) => {
            if (obj.condition && !obj.condition(this.state)) {
                return;
            }

            const objElement = document.createElement('div');
            objElement.className = 'scene-object interactive';
            objElement.innerHTML = `
                <span class="object-icon">${obj.icon || '●'}</span>
                <span class="object-name">${obj.name}</span>
            `;

            objElement.addEventListener('click', () => this.interactWithObject(obj));
            container.appendChild(objElement);
        });
    }

    /**
     * Render navigation options
     */
    renderNavigation(exits) {
        const container = document.getElementById('navigation-options');
        container.innerHTML = '';

        exits.forEach(exit => {
            if (exit.condition && !exit.condition(this.state)) {
                return;
            }

            const exitElement = document.createElement('div');
            exitElement.className = 'navigation-option interactive';
            exitElement.innerHTML = `
                <span class="nav-arrow">→</span>
                <span class="nav-label">${exit.label}</span>
            `;

            exitElement.addEventListener('click', () => {
                if (exit.action) {
                    exit.action(this);
                }
                this.loadScene(exit.target);
            });

            container.appendChild(exitElement);
        });
    }

    /**
     * Interact with an object
     */
    interactWithObject(obj) {
        if (obj.action) {
            obj.action(this);
        }

        if (obj.dialogue) {
            this.showDialogue(obj.dialogue);
        }

        if (obj.item) {
            this.addToInventory(obj.item);
            this.addJournalEntry(`Acquired: ${obj.item.name}`);
        }

        if (obj.puzzle) {
            this.showPuzzle(obj.puzzle);
        }

        if (obj.description) {
            this.showInteraction({
                title: obj.name,
                content: this.processText(obj.description)
            });
        }
    }

    /**
     * Show dialogue system
     */
    showDialogue(dialogue) {
        const box = document.getElementById('dialogue-box');
        const speaker = document.getElementById('dialogue-speaker');
        const text = document.getElementById('dialogue-text');
        const choices = document.getElementById('dialogue-choices');

        speaker.textContent = dialogue.speaker || '';
        text.innerHTML = this.processText(dialogue.text);

        box.classList.remove('hidden');
        box.classList.add('fade-in');

        // Render choices
        choices.innerHTML = '';
        if (dialogue.choices) {
            dialogue.choices.forEach((choice, index) => {
                if (choice.condition && !choice.condition(this.state)) {
                    return;
                }

                const choiceBtn = document.createElement('button');
                choiceBtn.className = 'dialogue-choice';
                choiceBtn.textContent = choice.text;
                choiceBtn.addEventListener('click', () => {
                    if (choice.action) {
                        choice.action(this);
                    }
                    if (choice.next) {
                        this.showDialogue(choice.next);
                    } else {
                        this.hideDialogue();
                    }
                });
                choices.appendChild(choiceBtn);
            });
        } else {
            const continueBtn = document.createElement('button');
            continueBtn.className = 'dialogue-choice';
            continueBtn.textContent = 'Continue...';
            continueBtn.addEventListener('click', () => {
                if (dialogue.next) {
                    this.showDialogue(dialogue.next);
                } else {
                    this.hideDialogue();
                }
            });
            choices.appendChild(continueBtn);
        }
    }

    /**
     * Hide dialogue
     */
    hideDialogue() {
        const box = document.getElementById('dialogue-box');
        box.classList.add('fade-out');
        setTimeout(() => {
            box.classList.remove('fade-in', 'fade-out');
            box.classList.add('hidden');
        }, 500);
    }

    /**
     * Show interaction overlay
     */
    showInteraction(data) {
        const overlay = document.getElementById('interaction-overlay');
        const content = document.getElementById('interaction-content');

        content.innerHTML = `
            <h2>${data.title}</h2>
            <div class="interaction-body">${data.content}</div>
        `;

        overlay.classList.remove('hidden');
        overlay.classList.add('fade-in');
    }

    /**
     * Close interaction overlay
     */
    closeInteraction() {
        const overlay = document.getElementById('interaction-overlay');
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.classList.remove('fade-in', 'fade-out');
            overlay.classList.add('hidden');
        }, 500);
    }

    /**
     * Inventory system
     */
    addToInventory(item) {
        if (!this.state.inventory.find(i => i.id === item.id)) {
            this.state.inventory.push(item);
            this.updateUI();
            this.showNotification(`Acquired: ${item.name}`);
        }
    }

    removeFromInventory(itemId) {
        this.state.inventory = this.state.inventory.filter(i => i.id !== itemId);
        this.updateUI();
    }

    hasItem(itemId) {
        return this.state.inventory.some(i => i.id === itemId);
    }

    /**
     * Journal system
     */
    addJournalEntry(text) {
        const entry = {
            text: text,
            timestamp: new Date().toISOString(),
            scene: this.state.currentScene
        };
        this.state.journal.unshift(entry);
        this.updateUI();
    }

    /**
     * Flag system for tracking choices and progress
     */
    setFlag(key, value) {
        this.state.flags[key] = value;
    }

    getFlag(key) {
        return this.state.flags[key];
    }

    /**
     * Stats modification
     */
    modifyEssence(amount) {
        this.state.stats.essence = Math.max(0, Math.min(100, this.state.stats.essence + amount));
        this.updateUI();

        if (this.state.stats.essence <= 0) {
            this.gameOver('essence');
        }
    }

    modifySanity(amount) {
        this.state.stats.sanity = Math.max(0, Math.min(100, this.state.stats.sanity + amount));
        this.updateUI();

        if (this.state.stats.sanity <= 0) {
            this.gameOver('sanity');
        }
    }

    /**
     * Update UI elements
     */
    updateUI() {
        // Update stats
        document.getElementById('essence-value').textContent = Math.floor(this.state.stats.essence);
        document.getElementById('sanity-value').textContent = Math.floor(this.state.stats.sanity);
        document.getElementById('depth-value').textContent = this.state.stats.depth;

        // Update inventory
        const invContainer = document.getElementById('inventory-items');
        invContainer.innerHTML = '';
        this.state.inventory.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'inventory-item';
            itemEl.innerHTML = `
                <span class="item-icon">${item.icon || '◆'}</span>
                <span class="item-name">${item.name}</span>
            `;
            itemEl.title = item.description || '';
            invContainer.appendChild(itemEl);
        });

        // Update journal
        const journalContainer = document.getElementById('journal-entries');
        journalContainer.innerHTML = '';
        this.state.journal.slice(0, 10).forEach(entry => {
            const entryEl = document.createElement('div');
            entryEl.className = 'journal-entry';
            entryEl.textContent = entry.text;
            journalContainer.appendChild(entryEl);
        });
    }

    /**
     * Particle system for atmosphere
     */
    startParticleSystem() {
        setInterval(() => {
            this.createParticle();
        }, 2000);

        this.animateParticles();
    }

    createParticle() {
        const container = document.getElementById('particle-container');
        const particle = document.createElement('div');
        particle.className = 'particle';

        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.opacity = Math.random() * 0.3;

        container.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 20000);
    }

    animateParticles() {
        requestAnimationFrame(() => this.animateParticles());
    }

    /**
     * Show notification
     */
    showNotification(text) {
        const notification = document.createElement('div');
        notification.className = 'notification fade-in';
        notification.textContent = text;
        document.getElementById('game-container').appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    /**
     * Save/Load system
     */
    saveGame() {
        try {
            localStorage.setItem('hades_pluton_save', JSON.stringify(this.state));
            this.showNotification('Memory preserved in shadow...');
        } catch (e) {
            console.error('Save failed:', e);
            this.showNotification('Failed to preserve memory...');
        }
    }

    autoSave() {
        try {
            localStorage.setItem('hades_pluton_autosave', JSON.stringify(this.state));
        } catch (e) {
            console.error('Auto-save failed:', e);
        }
    }

    loadGame() {
        try {
            const saved = localStorage.getItem('hades_pluton_save') ||
                         localStorage.getItem('hades_pluton_autosave');

            if (saved) {
                this.state = JSON.parse(saved);
                if (this.state.currentScene) {
                    this.loadScene(this.state.currentScene);
                }
                this.showNotification('Memory recalled from darkness...');
                return true;
            }
        } catch (e) {
            console.error('Load failed:', e);
        }
        return false;
    }

    restartGame() {
        if (confirm('Begin the journey anew? Current progress will be lost...')) {
            localStorage.removeItem('hades_pluton_save');
            localStorage.removeItem('hades_pluton_autosave');
            location.reload();
        }
    }

    /**
     * Menu system
     */
    toggleMenu() {
        const menu = document.getElementById('menu-overlay');
        menu.classList.toggle('hidden');
    }

    hideMenu() {
        document.getElementById('menu-overlay').classList.add('hidden');
    }

    /**
     * Audio system
     */
    initializeAudio() {
        // Placeholder for audio initialization
        // Can be extended with Web Audio API
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const btn = document.getElementById('audio-toggle');
        btn.textContent = this.audioEnabled ? '🔊' : '🔇';
    }

    /**
     * Game Over
     */
    gameOver(reason) {
        let message = '';
        if (reason === 'essence') {
            message = 'Your essence fades into eternal darkness...';
        } else if (reason === 'sanity') {
            message = 'Your mind dissolves into the void...';
        }

        this.showInteraction({
            title: 'Journey\'s End',
            content: `<p>${message}</p><p>Would you walk this path again?</p>
                     <button onclick="game.restartGame()" class="menu-btn">Begin Anew</button>`
        });
    }

    /**
     * Helper methods
     */
    focusInventory() {
        document.getElementById('inventory-panel').scrollIntoView({ behavior: 'smooth' });
    }

    focusJournal() {
        document.getElementById('journal-panel').scrollIntoView({ behavior: 'smooth' });
    }
}

// Global game instance
const game = new GameEngine();
