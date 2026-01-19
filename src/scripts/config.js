
export const categories = [
    { id: 'background', label: 'Background', zIndex: 10, group: 'base' },
    { id: 'pose', label: 'Pose', zIndex: 30, group: 'base' }, // Was body
    { id: 'legs', label: 'Legs', zIndex: 20, group: 'base' }, // Legs behind pose/body typically, or depends? 
    // If Pose includes body shape, legs might need to attach.
    // Let's set legs zIndex lower than pose if pose is the main body.
    { id: 'neck', label: 'Neck', zIndex: 35, group: 'base' },
    { id: 'mouth', label: 'Mouth', zIndex: 40, group: 'head' },
    { id: 'eyes', label: 'Eyes', zIndex: 45, group: 'head' },
    { id: 'ears', label: 'Ears', zIndex: 48, group: 'head' },
    { id: 'hair', label: 'Hair', zIndex: 50, group: 'head' },
    { id: 'accessories', label: 'Accessories', zIndex: 60, group: 'head' } // Default to head? Some might be body.
    // For simplicity, we'll treat general accessories as head accessories (glasses, hats).
    // If we have body accessories, we might need split categories.
];

export const assets = {
    background: [
        { id: 'blue', label: 'Blue Sky', file: 'blue.svg' },
        { id: 'green', label: 'Green Pasture', file: 'green.svg' },
        { id: 'transparent', label: 'None', file: 'transparent.svg' }
    ],
    legs: [
        { id: 'default', label: 'Default', file: 'default.svg' },
        { id: 'bubbletea', label: 'Bubble Tea', file: 'bubbletea.svg' },
        { id: 'cookie', label: 'Cookie', file: 'cookie.svg' },
        { id: 'gameconsole', label: 'Game Console', file: 'gameconsole.svg' },
        { id: 'backward', label: 'Backward Tilt', file: 'backward.svg' },
        { id: 'forward', label: 'Forward Tilt', file: 'forward.svg' }
    ],
    pose: [ // Renamed from body
        // Transforms: { x, y, scale, rotate } for Head group relative to default
        {
            id: 'default', label: 'Default', file: 'default.svg',
            headTransform: { x: 0, y: 0, scale: 1, rotate: 0 }
        },
        {
            id: 'bighead', label: 'Big Head', file: 'bighead.svg',
            headTransform: { x: 0, y: 50, scale: 1.5, rotate: 0 } // Lower y to fit big head?
        },
        {
            id: 'longneck', label: 'Long Neck', file: 'longneck.svg',
            headTransform: { x: 0, y: -150, scale: 0.9, rotate: 0 } // Move head up
        },
        {
            id: 'sidepose', label: 'Side Pose', file: 'sidepose.svg',
            headTransform: { x: 80, y: 0, scale: 1, rotate: 10 } // Shift right, tilt
        },
        {
            id: 'eating', label: 'Eating', file: 'eating.svg',
            headTransform: { x: 0, y: 50, scale: 1, rotate: -5 }
        },
        {
            id: 'gamer', label: 'Gamer', file: 'gamer.svg',
            headTransform: { x: -20, y: 20, scale: 1, rotate: -10 }
        },
        {
            id: 'chill', label: 'Chill', file: 'chill.svg',
            headTransform: { x: 0, y: 80, scale: 1, rotate: 5 }
        },
        {
            id: 'overexcited', label: 'Over Excited', file: 'overexcited.svg',
            headTransform: { x: 0, y: -50, scale: 1.1, rotate: 0 }
        }
    ],
    neck: [
        { id: 'default', label: 'Default Bend', file: 'default.svg' },
        { id: 'backward', label: 'Backward Bend', file: 'backward.svg' },
        { id: 'forward', label: 'Forward Thick', file: 'forward.svg' }
    ],
    mouth: [
        { id: 'default', label: 'Default', file: 'default.svg' },
        { id: 'astonished', label: 'Astonished', file: 'astonished.svg' },
        { id: 'eating', label: 'Eating', file: 'eating.svg' },
        { id: 'laugh', label: 'Laugh', file: 'laugh.svg' },
        { id: 'tongue', label: 'Tongue', file: 'tongue.svg' }
    ],
    eyes: [
        { id: 'default', label: 'Default', file: 'default.svg' },
        { id: 'angry', label: 'Angry', file: 'angry.svg' },
        { id: 'naughty', label: 'Naughty', file: 'naughty.svg' },
        { id: 'panda', label: 'Panda', file: 'panda.svg' },
        { id: 'smart', label: 'Smart', file: 'smart.svg' },
        { id: 'star', label: 'Star', file: 'star.svg' }
    ],
    ears: [
        { id: 'default', label: 'Default', file: 'default.svg' },
        { id: 'backward', label: 'Backward Tilt', file: 'backward.svg' },
        { id: 'forward', label: 'Forward Tilt', file: 'forward.svg' }
    ],
    hair: [
        { id: 'default', label: 'Default (None)', file: null },
        { id: 'bang', label: 'Bang', file: 'bang.svg' },
        { id: 'curls', label: 'Curls', file: 'curls.svg' },
        { id: 'elegant', label: 'Elegant', file: 'elegant.svg' },
        { id: 'quiff', label: 'Quiff', file: 'quiff.svg' },
        { id: 'short', label: 'Short', file: 'short.svg' }
    ],
    accessories: [
        { id: 'none', label: 'None', file: null },
        { id: 'earrings', label: 'Earrings', file: 'earrings.svg' },
        { id: 'flower', label: 'Flower', file: 'flower.svg' },
        { id: 'glasses', label: 'Glasses', file: 'glasses.svg' },
        { id: 'headphone', label: 'Headphone', file: 'headphone.svg' }
    ]
};

export const defaultState = {
    background: 'blue',
    legs: 'default',
    pose: 'default', // Renamed from body
    neck: 'default',
    mouth: 'default',
    eyes: 'default',
    ears: 'default',
    hair: 'default',
    accessories: 'none'
};

// Incompatibility Rules
// Format: { category: 'X', id: 'Y' } cannot be selected if { category: 'A', id: 'B' } is active.
// Current implementation: One-way check? Or mutual exclusion?
// Let's define simple "conflicts"
export const incompatibilities = [
    {
        // Example: Headphone conflicts with Ears? No, headphone goes over.
        // Maybe Mohawk (Quiff) conflicts with Hat (if we had one).
        // Let's say Big Curls hair conflicts with Headphone
        cause: { category: 'hair', id: 'curls' },
        effect: { category: 'accessories', id: 'headphone' },
        message: "Curls are too big for headphones!"
    },
    {
        // Example: Star eyes conflict with Glasses
        cause: { category: 'eyes', id: 'star' },
        effect: { category: 'accessories', id: 'glasses' },
        message: "Star eyes need to be seen!"
    }
];
