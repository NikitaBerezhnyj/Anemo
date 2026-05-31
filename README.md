# Anemo

<p align="center">
  <img src="./src/assets/icon.svg" alt="App logo" width="200"/>
</p>

Anemo is a simple web-based tool for developers and creators that allows you to:

- Generate phonetically balanced abstract names based on customizable length or syllables.
- Use precise character and syllable interval configurations via single or dual range sliders.
- Evolve existing name baselines, presets, or concepts using smart mutation and prefix matching.
- Quickly check domain availability shortcuts (.com, .io) directly from the results layout.

The app is currently a lightweight single-page application (SPA), optimized for minimal distraction and clean typography.

## Technologies

- [HTML5 & CSS3](https://developer.mozilla.org/en-US/docs/Web/HTML) — structured semantic layout and custom styling with glassmorphism effects.
- [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) — modular structure (`type="module"`) handles logic separation, ranges, and generation mechanics.

## Running the App

1. Ensure you have a standard web browser or a local static file server installed (e.g., Live Server extension for VS Code, Python's `http.server`, or Node's `serve`).

2. Clone the repository:

```bash
git clone https://github.com/NikitaBerezhnyj/Anemo.git
cd Anemo
```

3. Open the entry point file:

- For a direct look, you can simply open `index.html` in your web browser.
- Alternatively, spin up a local server in the project directory:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if installed globally)
npx serve .
```

4. Open `http://localhost:8000` (or the respective local port) in your browser.

## License & Community Guidelines

- [MIT License](https://www.google.com/search?q=LICENSE) — project license.
- [Code of Conduct](https://www.google.com/search?q=CODE_OF_CONDUCT.md) — expected behavior for contributors.
- [Contributing Guide](https://www.google.com/search?q=CONTRIBUTING.md) — how to help the project.
- [Security Policy](SECURITY.md) — reporting security issues.
