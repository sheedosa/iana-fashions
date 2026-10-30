// Facts for I&A Fashions. Business details come from the schoolwear site (same company, same shop).
// Anything not confirmed by the client goes in toConfirm, never on the page as fact.
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
  // This build is a concept preview: products below are samples and online ordering is off.
  preview: true,
  toConfirm: [
    "product range, names and prices",
    "fabrics stocked",
    "whether every abaya and dress is cut in Petite, Regular and Tall",
    "length measurements per size",
    "delivery charges and returns window",
    "click and collect and try-on reservations in the Tooting shop",
  ],
};

// Lengths are the concept's core idea. Measurements are proposals until the client confirms them.
export const LENGTHS = [
  { id: "petite", name: "Petite", inches: 52, fits: "up to 5'3\"", maxIn: 63 },
  { id: "regular", name: "Regular", inches: 56, fits: "5'3\" to 5'7\"", maxIn: 67 },
  { id: "tall", name: "Tall", inches: 60, fits: "5'7\" and over", maxIn: 999 },
] as const;
export type LengthId = (typeof LENGTHS)[number]["id"];

export function lengthForHeight(totalInches: number): LengthId {
  return (LENGTHS.find((l) => totalInches < l.maxIn) ?? LENGTHS[2]).id;
}
