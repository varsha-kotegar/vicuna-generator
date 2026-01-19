
import { categories, assets } from './config.js';
import { stateManager } from './state.js';
import { renderer } from './renderer.js';

const categoryNav = document.getElementById('category-nav');
const stylesGrid = document.getElementById('styles-grid');
let activeCategory = categories[0].id; // Background by default

function init() {
    renderCategories();
    renderStyles();

    // Subscribe to state changes
    stateManager.subscribe((state, computed) => {
        renderer.update(state);
        updateUI(state, computed);
    });

    // Buttons
    document.getElementById('btn-random').addEventListener('click', () => stateManager.randomize());
    document.getElementById('btn-reset').addEventListener('click', () => stateManager.reset());

    const dlBtn = document.getElementById('btn-download');
    dlBtn.addEventListener('click', () => {
        // We need state to download. Renderer helper needs refactoring to accept state or we pass it here.
        // Let's implement download logic here or in renderer fully.
        // Renderer download function was not fully complete in previous step (check content). 
        // Let's invoke a complete download function here or fix renderer.
        generateDownload(stateManager.getState());
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
}

function handleKeyboard(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        // Navigate styles in current category
        const currentStyleId = stateManager.getState()[activeCategory];
        const opts = assets[activeCategory];
        const idx = opts.findIndex(a => a.id === currentStyleId);

        if (idx !== -1) {
            let newIdx = idx;
            if (e.key === 'ArrowRight') newIdx = (idx + 1) % opts.length;
            if (e.key === 'ArrowLeft') newIdx = (idx - 1 + opts.length) % opts.length;

            // Check if disabled?
            const nextOpt = opts[newIdx];
            // If disabled, skip? Complex logic. Simple for now: just set it.
            // If state manager rejects or handles Incompat, it's fine.
            stateManager.setStyle(activeCategory, nextOpt.id);
        }
    }
}

function renderCategories() {
    categoryNav.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `category-btn ${cat.id === activeCategory ? 'active' : ''}`;
        btn.textContent = cat.label;
        btn.onclick = () => {
            activeCategory = cat.id;
            renderCategories(); // Re-render to update active class
            renderStyles();
        };
        categoryNav.appendChild(btn);
    });
}

function renderStyles() {
    stylesGrid.innerHTML = '';
    const catAssets = assets[activeCategory] || [];

    catAssets.forEach(opt => {
        const card = document.createElement('button'); // Use button for a11y
        card.className = 'style-card';
        card.dataset.id = opt.id;
        card.title = opt.label; // Tooltip simple

        // Accessibility
        card.setAttribute('aria-label', `Select ${opt.label}`);

        card.onclick = () => {
            if (!card.disabled) {
                stateManager.setStyle(activeCategory, opt.id);
            }
        };

        let previewHTML = '';
        if (opt.file) {
            card.classList.add('has-image');
            previewHTML = `<div class="style-preview"><img src="/assets/vicuna/${activeCategory}/${opt.file}" alt="" loading="lazy"></div>`;
        }

        card.innerHTML = `
            ${previewHTML}
            <span class="style-name">${opt.label}</span>
        `;
        stylesGrid.appendChild(card);
    });

    // Initial UI update for selection
    const state = stateManager.getState();
    const computed = stateManager.getComputedState(); // We can get this from store if we expose it or just recalculate
    updateUI(state, computed);
}

function updateUI(state, computed) {
    // Highlight active style
    const currentStyle = state[activeCategory];
    const cards = Array.from(stylesGrid.children);

    cards.forEach(card => {
        const id = card.dataset.id;
        const isSelected = id === currentStyle;

        if (isSelected) card.classList.add('selected');
        else card.classList.remove('selected');

        // Check disabled
        const key = `${activeCategory}:${id}`;
        if (computed && computed.disabled && computed.disabled[key]) {
            card.disabled = true;
            card.classList.add('disabled');
            card.title = computed.disabled[key]; // Show reason in tooltip
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
        } else {
            card.disabled = false;
            card.classList.remove('disabled');
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
            // Restore title
            const opt = assets[activeCategory].find(a => a.id === id);
            if (opt) card.title = opt.label;
        }
    });
}

// Download Logic (Moved locally or reused)
async function generateDownload(state) {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Background fill to ensure no transparency issues if desired, 
    // but transparent background is requested often.
    // ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,1000,1000);

    const sortedCats = [...categories].sort((a, b) => a.zIndex - b.zIndex);

    const loadImage = (src) => new Promise(r => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => r(img);
        img.onerror = () => r(null);
        img.src = src;
    });

    for (const cat of sortedCats) {
        const styleId = state[cat.id];
        const asset = assets[cat.id].find(a => a.id === styleId);
        if (asset && asset.file) {
            const img = await loadImage(`/assets/vicuna/${cat.id}/${asset.file}`);
            if (img) ctx.drawImage(img, 0, 0, 1000, 1000);
        }
    }

    const link = document.createElement('a');
    link.download = `vicuna-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Init
init();
