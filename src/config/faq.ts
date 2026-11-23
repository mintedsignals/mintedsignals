/** Questions and answers shown on the page. Also published as FAQPage JSON-LD. */
export const calculatorFaq = [
  {
    q: "How do I convert a prediction market price to a probability?",
    a: "The price of a YES share in cents is the implied chance in percent. A share trading at 62¢ means the market puts the chance at about 62%.",
  },
  {
    q: "How much do I win if I'm right?",
    a: "Each share pays $1 if the outcome happens. Your profit per share is $1 minus the price you paid, so a 62¢ share makes 38¢ if it wins and loses 62¢ if it doesn't.",
  },
  {
    q: "Does the calculator include fees?",
    a: "No. It shows payouts before fees, spreads and slippage, which all reduce what you actually receive. Check each platform's fees before trading.",
  },
  {
    q: "How do prediction market odds compare with sportsbook odds?",
    a: "Decimal odds are 1 divided by the price as a decimal: a 62¢ share is about 1.61 in decimal odds. Our guide to reading odds covers fractional and American odds too.",
  },
];
