/**
 * AMAMAZA — central business config. Edit values here; the whole app updates.
 * Prices are PLACEHOLDERS until the business confirms real rates.
 */
export const site = {
  name: "Amamaza",
  taglineRw: "Kwamamaza neza. Byoroshye. Ku giciro gito.",
  taglineEn: "Advertise well. Simply. Affordably.",
  contact: {
    phone: "+250 788 000 000",
    email: "muraho@amamaza.rw",
    address: "KG 7 Ave, Kigali, Rwanda",
    whatsapp: "+250 788 000 000",
  },
  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    x: "https://x.com/",
    youtube: "https://youtube.com/",
  },
  currency: "RWF",
};

/** Placeholder pricing (RWF). Change freely. */
export const pricing = {
  base: { video: 15000, flyer: 3000, banner: 5000, template: 2500 },
  perVideoSecond: 800,
  quality: { standard: 1, hd: 1.4, premium: 2 },
  proServiceFrom: 50000,
  topUpOptions: [5000, 10000, 25000, 50000],
};
