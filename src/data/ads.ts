import restaurant from "@/assets/ads/restaurant.jpg";
import fashion from "@/assets/ads/fashion.jpg";
import hotel from "@/assets/ads/hotel.jpg";
import juice from "@/assets/ads/juice.jpg";
import shopBanner from "@/assets/ads/shop-banner.jpg";
import salon from "@/assets/ads/salon.jpg";
import realestate from "@/assets/ads/realestate.jpg";
import techBanner from "@/assets/ads/tech-banner.jpg";

export type Category = "restaurants" | "fashion" | "hotels" | "products" | "realestate" | "services";
export type Format = "video" | "flyer" | "banner";

export interface SampleAd {
  id: string;
  title: string;
  business: string;
  category: Category;
  format: Format;
  ratio: "9:16" | "4:5" | "16:9" | "3:2" | "2:1";
  duration?: string;
  image: string;
  descRw: string;
  descEn: string;
  style: string;
}

export const images = { restaurant, fashion, hotel, juice, shopBanner, salon, realestate, techBanner };

/** Demo samples — clearly labeled as examples ("Urugero") in the UI. */
export const sampleAds: SampleAd[] = [
  { id: "resto-tilapia", title: "Ifunguro Rishya", business: "Inzu y'Amafunguro", category: "restaurants", format: "video", ratio: "4:5", duration: "0:15", image: restaurant, descRw: "Video ngufi yamamaza ifunguro rishya rya resitora.", descEn: "Short video promoting a restaurant's new dish.", style: "cinematic" },
  { id: "shop-mamakeza", title: "Mama Keza Supermarket", business: "Mama Keza", category: "products", format: "banner", ratio: "3:2", image: shopBanner, descRw: "Banner yo hejuru y'iduka — isomeka kure.", descEn: "Storefront banner — readable from the street.", style: "energetic" },
  { id: "fashion-kitenge", title: "Imyenda Mishya", business: "Kigali Style Boutique", category: "fashion", format: "flyer", ratio: "4:5", image: fashion, descRw: "Flyer ya promosiyo ya weekend.", descEn: "Weekend sale flyer.", style: "energetic" },
  { id: "hotel-kivu", title: "Ikiruhuko cy'Inzozi", business: "Lake Kivu Lodge", category: "hotels", format: "video", ratio: "4:5", duration: "0:20", image: hotel, descRw: "Video y'amahoteli ifite isura y'akataraboneka.", descEn: "Luxury hotel video ad.", style: "luxury" },
  { id: "tech-zone", title: "Telefoni Zigezweho", business: "Tech Zone", category: "products", format: "banner", ratio: "2:1", image: techBanner, descRw: "Banner nini y'iduka rya telefoni.", descEn: "Large phone-shop banner.", style: "premium" },
  { id: "juice-passion", title: "Umutobe w'Umwimere", business: "Fresh Valley", category: "products", format: "video", ratio: "4:5", duration: "0:10", image: juice, descRw: "Video y'igicuruzwa ifite imbaraga.", descEn: "Energetic product commercial.", style: "energetic" },
  { id: "salon-bella", title: "Imisatsi Myiza", business: "Salon Bella", category: "services", format: "flyer", ratio: "4:5", image: salon, descRw: "Flyer nziza ya salon y'ubwiza.", descEn: "Elegant beauty salon flyer.", style: "minimal" },
  { id: "house-kibagabaga", title: "Inzu Igurishwa", business: "Kigali Homes", category: "realestate", format: "banner", ratio: "3:2", image: realestate, descRw: "Banner yo kugurisha inzu.", descEn: "Property-for-sale banner.", style: "premium" },
];

export const categories: { id: Category | "all"; rw: string; en: string }[] = [
  { id: "all", rw: "Zose", en: "All" },
  { id: "restaurants", rw: "Resitora", en: "Restaurants" },
  { id: "fashion", rw: "Imyenda", en: "Fashion" },
  { id: "hotels", rw: "Amahoteli", en: "Hotels" },
  { id: "products", rw: "Ibicuruzwa", en: "Products" },
  { id: "realestate", rw: "Amazu", en: "Real Estate" },
  { id: "services", rw: "Serivisi", en: "Services" },
];

export const formatLabel: Record<Format, { rw: string; en: string }> = {
  video: { rw: "Video", en: "Video" },
  flyer: { rw: "Flyer", en: "Flyer" },
  banner: { rw: "Banner", en: "Banner" },
};
