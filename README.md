# Calculator (Vanilla JS, MVVM)

A browser calculator built with plain JavaScript and no front-end framework. The app is small on purpose: it is an exercise in structuring UI code with the Model-View-ViewModel (MVVM) pattern, using only language features and the DOM API.

## Features

- Addition, subtraction, multiplication and division
- `AC` clears the current calculation
- `=` evaluates the expression, and the result becomes the first operand of the next calculation, so you can keep chaining operations
- Division by zero returns `0` instead of `Infinity`
- A single display that always shows the number currently being entered or the last result

## Tech stack

- JavaScript (ES2022 private class fields, IIFE modules), HTML and CSS
- [Express](https://expressjs.com/) 4, used only as a static file server for local development

## Architecture

All application logic lives in [`app/script.js`](app/script.js), split into three modules. Each one is an immediately invoked function expression (IIFE) that returns only what the other layers need.

```
 click ──► ViewModel ──► Model.State ──(onChange)──► ViewModel ──► View.renderCurrentNum()
```

**Model** exposes a `State` class that owns every piece of calculator data in private fields (`#num1`, `#operation`, `#num2`, `#currentNumber`). Nothing outside the class can change them directly. The public methods (`appendToCurrentNumber`, `setOperation`, `calculate`, `clear`) are the only way to change state. Each one calls a single change callback when it finishes. The Model knows nothing about the DOM.

**View** looks up the DOM once. It builds an `elements` map that links a key (`'0'`–`'9'`, `'add'`, `'divide'`, `'clear'`, and so on) to its button. It also exposes one render function, `renderCurrentNum(num)`, which writes a value to the display. The View holds no state and has no event logic.

**ViewModel** receives the Model and View as arguments, creates the `State` instance, and connects the two sides:

1. It loops over `View.elements` and attaches a click handler to each button. The handler turns the button key into a Model command: single-character keys become digits, and named keys become `calculate`, `clear` or an operation.
2. It calls `state.subscribe(...)` so that every state change re-renders the display from `state.currentNumber`.

Data flows in one direction. User input goes through the ViewModel into the Model. The Model reports that something changed, and the ViewModel reads the new state and tells the View what to show. The Model and View never reference each other, so the calculation logic stays independent of the DOM.

## Getting started

Requirements: Node.js and a modern browser (private class fields need Chrome 74+, Firefox 90+ or Safari 14.1+).

```bash
git clone https://github.com/shanehobson/calculator-vanillajs-mvvm.git
cd calculator-vanillajs-mvvm
npm install
npm start
```

Then open http://localhost:3001. To use a different port, set `PORT`, for example `PORT=8080 npm start`.

The app is fully static, so you can also open `app/index.html` directly in a browser.

## Project structure

```
app/
  index.html   calculator markup (display and button grid)
  script.js    Model, View and ViewModel
  style.css    layout and styling
server.js      Express static server
```

## Known limitations

- The decimal-point button appears in the UI, but the ViewModel does not handle it yet. Decimal input is not supported.
- There are no automated tests. `npm test` is the default placeholder.
