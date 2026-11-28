// Questions on the pricing page. They show on the page and are also given to search engines and AI
// assistants as structured data (src/seo.js), so each answer has to stand on its own. No figures in here
// on purpose: prices are read live from the backend, and a price written into structured data goes stale.

export const PRICING_FAQ = [
  ["What counts as an active project?",
    "A project is active from its start date until you mark it complete. Finished projects stay readable and stop billing, so closing out a job is the thing that stops the charge."],
  ["Who pays for the crews on site?",
    "Nobody. Field crew and field lead seats are free on every project. The trades report their work without anyone counting seats, which is the only way field data ever actually arrives."],
  ["How does 1iQ price a portfolio?",
    "Each active project bills at its own budget band, so a portfolio is the sum of its projects. Above $50M, or where the reporting is shaped by who needs to see what and how often, it is quoted at a briefing instead."],
  ["Do we have to move off Procore to use 1iQ?",
    "No. Your general contractor carries on in Procore and 1iQ connects to it. The integrations are in the price rather than a separate line."],
];
