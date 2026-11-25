# BridgeNet build plan

Build a complete, responsive four-tab web app for displaced talent, with no login and all interactions working in the browser.

## Pages and interactions

- **Home:** the requested hero and Amina sample profile, three audience buttons, and the three impact statistics. Audience buttons open the relevant next step; loading Amina fills the matching form.
- **Matching Engine:** talent details form, three requested job matches, match scores and salaries, and a working Apply confirmation for each job.
- **Mentor Tracker:** Grace Wanjiru's profile, 60% starting progress, three checklist tasks, completion steps at 80% and 100%, and a working message confirmation.
- **Returnship Marketplace:** three paid trials with working application confirmations and a conversion banner whose offer button reveals the requested full-time offer and accept action.

## Design and verification

- Use a warm, editorial visual style with the exact burgundy `#941748` and teal `#00A8B5` as design tokens, clear mobile navigation, and accessible confirmations.
- Keep everything in the existing home page; no login or backend is needed for this demo.
- Add focused interaction tests and check the live app in a browser, including mobile layout and every requested button.

## Technical notes

Implement with React state in `src/routes/index.tsx`, reusable local components, Lucide icons, Tailwind v4 tokens in `src/styles.css`, and route-specific metadata. No database changes are required.
