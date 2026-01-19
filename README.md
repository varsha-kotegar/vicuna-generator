# Vicuña Image Generator

A fun, interactive web application to customize and generate your own Vicuña character! Built with **Astro** and **Vanilla JavaScript**.

## Features

- **Layered Customization**: Assemble your Vicuña using stacked SVG layers.
- **Expressive Poses**: Choose from dramatic body shapes like "Big Head", "Long Neck", "Gamer Pose", and more.
- **Smart Transforms**: Facial features automatically adjust (move, scale, rotate) to fit the selected body pose.
- **Rich Categories**: Customize Ear, Neck, Mouth, Hair, Eyes, Legs, and Accessories.
- **Interactive UI**:
    -   Light Mode aesthetic inspired by "Alpaca Generator".
    -   Live preview with smooth transitions.
    -   Incompatibility logic (e.g., specific hair styles limit accessories).
    -   Keyboard navigation support.
-   **Actions**:
    -   **Randomize**: Generate a unique character instantly.
    -   **Download**: Export your creation as a high-quality 1000x1000 PNG.
    -   **Reset**: Return to the default state.
-   **Persistence**: Your design is saved automatically to your browser's local storage.

## Tech Stack

-   **Framework**: [Astro](https://astro.build) (Minimal template)
-   **Logic**: Vanilla JavaScript (ES Modules)
-   **State Management**: Custom `StateManager` with subscription pattern.
-   **Rendering**: DOM manipulation for preview, HTML5 Canvas for export.
-   **Styling**: Modern CSS (Grid, Flexbox, Variables, Transforms).

## Getting Started

1.  **Clone the repository**:
    ```sh
    git clone https://github.com/varsha-kotegar/vicuna-generator.git
    cd vicuna-generator
    ```

2.  **Install dependencies**:
    ```sh
    npm install
    ```

3.  **Run the development server**:
    ```sh
    npm run dev
    ```
    Open your browser to `http://localhost:4321`.

4.  **Build for production**:
    ```sh
    npm run build
    ```

## Project Structure

```text
/
├── public/assets/vicuna/   # SVG assets organized by category (pose, eyes, etc.)
├── src/
│   ├── pages/
│   │   └── index.astro     # Main entry point and HTML structure
│   ├── scripts/
│   │   ├── config.js       # configuration (categories, assets, incompatibility rules)
│   │   ├── state.js        # State management and persistence logic
│   │   ├── renderer.js     # Handles DOM updates and Canvas drawing
│   │   └── controls.js     # UI event listeners and interaction logic
│   └── styles/
│       ├── global.css      # Core variables and reset
│       └── generator.css   # App-specific layout and component styles
└── package.json


