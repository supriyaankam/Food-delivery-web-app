import biryani from "../assets/images/defaults/biryani.png";
import drinks from "../assets/images/defaults/drinks.png";
import friedrice from "../assets/images/defaults/friedrice.png";
import icecream from "../assets/images/defaults/icecream.png";
import milkshake from "../assets/images/defaults/milkshake.png";
import mocktail from "../assets/images/defaults/mocktail.png";
import noodles from "../assets/images/defaults/noodles.png";
import snack from "../assets/images/defaults/snack.png";
import starter from "../assets/images/defaults/starter.png";
import defaultImg from "../assets/images/defaults/default.png";

export const getDefaultImage = (category) => {
  if (!category) return defaultImg;
  
  const lowerCat = category.toLowerCase().trim();
  
  if (lowerCat.includes("biryani")) return biryani;
  if (lowerCat.includes("drink")) return drinks;
  if (lowerCat.includes("rice")) return friedrice;
  if (lowerCat.includes("ice cream") || lowerCat.includes("icecream") || lowerCat.includes("ice-cream")) return icecream;
  if (lowerCat.includes("milkshake") || lowerCat.includes("shake")) return milkshake;
  if (lowerCat.includes("mocktail") || lowerCat.includes("mojito")) return mocktail;
  if (lowerCat.includes("noodle") || lowerCat.includes("pasta") || lowerCat.includes("maggie")) return noodles;
  if (lowerCat.includes("snack") || lowerCat.includes("samosa") || lowerCat.includes("pav bhaji")) return snack;
  if (lowerCat.includes("starter") || lowerCat.includes("manchurian") || lowerCat.includes("lollipop") || lowerCat.includes("tikka")) return starter;

  return defaultImg; // Fallback
};
