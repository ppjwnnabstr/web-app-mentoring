# SVI Login Page

A self-contained React login page for the SVI brand.

## Files
- `LoginPage.jsx` — the component
- `LoginPage.css` — styles (plain CSS, no Tailwind/framework required)
- `svi-logo.jpg` — the SVI logo, referenced by the component
- `App.jsx` — minimal usage example

## Use it

```jsx
import LoginPage from "./LoginPage";

function App() {
  const handleSubmit = async ({ email, password, remember }) => {
    // call your auth API here
  };

  return <LoginPage onSubmit={handleSubmit} />;
}
```

`onSubmit` is optional — omit it and the form will just simulate a
900ms sign-in for local preview.

## Notes
- Fonts (Space Grotesk, Inter, JetBrains Mono) load from Google Fonts via
  the `@import` at the top of `LoginPage.css`. Swap for local/self-hosted
  fonts if you need to work offline or avoid the external request.
- Fully responsive: collapses to a single column under 880px.
- Keyboard-focus states and `prefers-reduced-motion` are handled.
- Coordinates in the brand panel ("Origin") are a placeholder detail —
  swap for whatever's meaningful (HQ location, live shipment, etc.).
