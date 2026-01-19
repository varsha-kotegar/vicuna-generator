
import { defaultState, assets, categories, incompatibilities } from './config.js';

const STORAGE_KEY = 'vicuna-generator-state-v2'; // Bumped version

class StateManager {
    constructor() {
        this.state = { ...defaultState };
        this.listeners = [];
        this.load();
    }

    subscribe(callback) {
        this.listeners.push(callback);
        this.notifyOne(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notify() {
        this.listeners.forEach(cb => this.notifyOne(cb));
        this.save();
    }

    notifyOne(cb) {
        // Compute derived state (validity)
        const computed = this.getComputedState();
        cb(this.state, computed);
    }

    load() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Validate against current assets to avoid zombie states
                const sanitized = { ...defaultState };
                Object.keys(parsed).forEach(key => {
                    // Check if category exists and style exists
                    if (assets[key] && assets[key].some(a => a.id === parsed[key])) {
                        sanitized[key] = parsed[key];
                    }
                });
                this.state = sanitized;
            } catch (e) {
                console.error('Failed to load state', e);
            }
        }
    }

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }

    setStyle(category, styleId) {
        if (this.state[category] !== styleId) {
            // Check incompatibility before setting?
            // If user clicks a restricted item, we could:
            // 1. Block it.
            // 2. Auto-remove the conflicting item.
            // Requirement: "Disable incompatible combinations automatically". 
            // usually means buttons are disabled.
            // But if we force set, we should probably resolve conflict.
            // For now, assume UI prevents clicking.
            this.state[category] = styleId;
            this.notify();
        }
    }

    reset() {
        this.state = { ...defaultState };
        this.notify();
    }

    randomize() {
        const newState = { ...defaultState };
        for (const cat of categories) {
            const opts = assets[cat.id];
            if (opts && opts.length > 0) {
                // simple random, refined later to avoid repetition if needed
                let randomOpt;
                let attempts = 0;
                do {
                    randomOpt = opts[Math.floor(Math.random() * opts.length)];
                    attempts++;
                } while (randomOpt.id === this.state[cat.id] && opts.length > 1 && attempts < 5);

                newState[cat.id] = randomOpt.id;
            }
        }
        this.state = newState;
        // Post-randomize validation: if incompatible, revert to default for dependent
        this.resolveIncompatibilities(newState);
        this.notify();
    }

    // Helper to fix conflicts in a given state object
    resolveIncompatibilities(stateObj) {
        incompatibilities.forEach(rule => {
            if (stateObj[rule.cause.category] === rule.cause.id &&
                stateObj[rule.effect.category] === rule.effect.id) {
                // Conflict found. Reset effect to default.
                stateObj[rule.effect.category] = defaultState[rule.effect.category];
            }
        });
    }

    getComputedState() {
        // Return list of disabled items based on current state
        const disabled = {}; // { 'category:id': 'Reason' }
        incompatibilities.forEach(rule => {
            if (this.state[rule.cause.category] === rule.cause.id) {
                const key = `${rule.effect.category}:${rule.effect.id}`;
                disabled[key] = rule.message;
            }
        });
        return { disabled };
    }

    getState() {
        return this.state;
    }
}

export const stateManager = new StateManager();
