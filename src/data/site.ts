// Facts for I&A Fashions. Business details come from the schoolwear site (same company, same shop);
// range, delivery and returns were confirmed by the client. Anything not confirmed goes in toConfirm, never on the page as fact.
export const SITE = {
  name: "I&A Fashions",
  legalName: "I & A Fashions Limited",
  companyNumber: "07202123",
  vat: "338770178",
  since: 1993,
  address: { street: "84 Mitcham Road", area: "Tooting", city: "London", postcode: "SW17 9NG" },
  phone: "020 8767 8613",
  phoneIntl: "+442087678613",
  hours: "Monday to Sunday, 9am to 6pm",
  email: "",
  social: { instagram: "https://www.instagram.com/iafashions/", facebook: "https://www.facebook.com/iafashions/" },
  url: "https://sheedosa.github.io/iana-fashions",
  sister: { name: "I&A Schoolwear", url: "https://sheedosa.github.io/iana-schoolwear/" },

  // Confirmed by the client.
  range: {
    abayas: "about 10 abayas at any time, changing weekly or monthly",
    hijabs: "about 20 hijab styles, each in five colours or more",
    coords: "about 10 co-ords",
    fabrics: ["Cotton", "Jersey", "Polyester"],
    priceFrom: 18,
    priceTo: 65,
  },
  alterations: {
    summary: "Every abaya can be taken up or amended in the shop.",
    bespoke: "Custom and bespoke abayas are coming soon.",
  },
  preorders: "We take pre-orders for new collections and for Eid.",
  delivery: {
    standard: { label: "Standard delivery", price: 4.95, time: "5 working days" },
    express: { label: "Express delivery", price: 7.95, time: "48 hours" },
    freeOver: 100,
    collect: "Click and collect from 84 Mitcham Road, Tooting",
  },
  returns: { days: 28, excluded: ["suits", "bridal dresses", "prom dresses"] },

  // This build is a concept preview: products below are samples and online ordering is off.
  preview: true,
  toConfirm: [
    "product names, photographs and prices (the pieces on this site are samples priced inside the confirmed £18 to £65 range)",
    "hijab style names and colour names per style",
    "alteration prices",
    "alteration turnaround",
    "launch date for custom and bespoke abayas",
    "Eid pre-order opening and collection dates",
    "sizes offered per piece",
    "shop-front photograph",
    "how to send a return, and whether altered items can be returned",
    "click and collect charge, if any",
  ],
};

export const gbp = (n: number) => `£${n % 1 === 0 ? n : n.toFixed(2)}`;
export const DELIVERY_LINE = `Standard ${gbp(SITE.delivery.standard.price)} (${SITE.delivery.standard.time}), express ${gbp(SITE.delivery.express.price)} (${SITE.delivery.express.time}). Free on orders of ${gbp(SITE.delivery.freeOver)} and over.`;
export const RETURNS_LINE = `${SITE.returns.days}-day returns. Suits, bridal dresses and prom dresses are excluded.`;
