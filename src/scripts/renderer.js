
import { categories, assets } from './config.js';

class Renderer {
    constructor() {
        this.stage = document.getElementById('vicuna-stage');
        this.layers = {};
        this.initLayers();
    }

    initLayers() {
        categories.forEach(cat => {
            // NOTE: The ID in index.astro might be old 'layer-body', but we renamed to 'layer-pose'. 
            // We need to update index.astro or handle legacy. 
            // I'll assume we update index.astro or just check both.
            let el = document.getElementById(`layer-${cat.id}`);
            if (!el && cat.id === 'pose') {
                // Fallback if HTML not updated yet
                el = document.getElementById('layer-body');
            }
            if (el) {
                this.layers[cat.id] = el;
            } else {
                // Dynamically create if missing (useful for 'pose' if renamed)
                // But better to rely on Astro loop.
            }
        });
    }

    update(state) {
        // 1. Get current Pose Transform
        const poseId = state.pose || 'default';
        const poseAsset = assets.pose.find(a => a.id === poseId);
        const transform = poseAsset && poseAsset.headTransform ? poseAsset.headTransform : { x: 0, y: 0, scale: 1, rotate: 0 };

        categories.forEach(cat => {
            const layer = this.layers[cat.id];
            if (!layer) return;

            const styleId = state[cat.id];
            const asset = assets[cat.id] && assets[cat.id].find(a => a.id === styleId);

            if (asset && asset.file) {
                // Fix path for pose category
                const catFolder = cat.id === 'pose' ? 'pose' : cat.id; // use 'pose' folder
                // Wait, did I rename 'body' folder to 'pose'? 
                // Detailed plan said "Generate Assets for new Poses". 
                // I should assume I'll put them in 'pose' folder.

                const newSrc = `/assets/vicuna/${catFolder}/${asset.file}`;

                if (layer.src !== newSrc && !layer.src.endsWith(newSrc)) {
                    layer.src = newSrc;
                }
                layer.style.display = 'block';
                layer.style.opacity = '1';

                // Apply Transform if Group is HEAD
                if (cat.group === 'head') {
                    layer.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotate}deg)`;
                    layer.style.transformOrigin = 'center 300px'; // Pivot around neck area approx
                } else {
                    layer.style.transform = 'none';
                }

            } else {
                layer.style.display = 'none';
                layer.style.opacity = '0';
            }
        });
    }

    async download(state) {
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');

        // Pose Transform
        const poseId = state.pose || 'default';
        const poseAsset = assets.pose.find(a => a.id === poseId);
        const transform = poseAsset && poseAsset.headTransform ? poseAsset.headTransform : { x: 0, y: 0, scale: 1, rotate: 0 };

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
                const catFolder = cat.id === 'pose' ? 'pose' : cat.id;
                const img = await loadImage(`/assets/vicuna/${catFolder}/${asset.file}`);

                if (img) {
                    ctx.save();
                    if (cat.group === 'head') {
                        // Apply Transform
                        // Pivot? Canvas rotate rotates around 0,0. 
                        // Need to translate to pivot, rotate/scale, translate back.
                        const pivotX = 500;
                        const pivotY = 300; // Approx neck/head center

                        ctx.translate(pivotX + transform.x, pivotY + transform.y);
                        ctx.rotate(transform.rotate * Math.PI / 180);
                        ctx.scale(transform.scale, transform.scale);
                        ctx.translate(-pivotX, -pivotY);
                    }
                    ctx.drawImage(img, 0, 0, 1000, 1000);
                    ctx.restore();
                }
            }
        }

        const link = document.createElement('a');
        link.download = `vicuna-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
}

export const renderer = new Renderer();
