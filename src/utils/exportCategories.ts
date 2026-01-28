// src/utils/exportCategories.ts

export type ProductCategory = {
    id: string;
    label: string;
  };
  
  /**
   * MAIN categories – taken from the UL you pasted.
   * id must be UNIQUE and stable.
   */
  export const productCategories: ProductCategory[] = [
    { id: "apparel-exporters-in-sri-lanka", label: "Apparel & Textiles" },
    { id: "ayurvedic-herbal", label: "Ayurvedic & Herbal Products" },
    { id: "boat-ship-building-exporters-in-sri-lanka", label: "Boat and Ship Building" },
    { id: "ceramics-porcelain-products-manufacturers", label: "Ceramics & Porcelain Products" },
    { id: "chemicals-and-plastic-products-exporters", label: "Chemicals & Plastic Products" },
    { id: "coconut-product-exporters-in-sri-lanka", label: "Coconut & Coconut based Products" },
    { id: "floriculture-exporters-in-sri-lanka", label: "Cut Flowers & Foliage" },
    { id: "gem-diamond-and-jewellery-exporters-in-sri-lanka", label: "Diamonds, Gems & Jewellery" },
    {
      id: "electrical-electronic-products-exporters-in-sri-lanka",
      label: "Electrical and Electronic Products",
    },
    { id: "engineering-products-exporters-in-sri-lanka", label: "Engineering Products" },
    { id: "fish-fisheries-product-exporters-in-sri-lanka", label: "Fish & Fisheries Products" },
    { id: "food-and-beverages-exporters-in-sri-lanka", label: "Food, Feed & Beverages" },
    { id: "footwear-parts-exporters-in-sri-lanka", label: "Footwear and Parts" },
    { id: "fruits-nuts-vegetables-exporters-in-sri-lanka", label: "Fruits, Nuts and Vegetables" },
    { id: "giftware-and-toys-exporters-in-sri-lanka", label: "Giftware & Toys" },
    { id: "leather-products-exporters-in-sri-lanka", label: "Leather Products" },
    { id: "light-engineering-services-sri-lanka", label: "Light Engineering Products" },
    {
      id: "non-metallic-mineral-products-exporters-in-sri-lanka",
      label: "Non-metallic Mineral Products",
    },
    { id: "organic-products-exporters-in-sri-lanka", label: "Organic Products" },
    { id: "aquarium-fish", label: "Ornamental Fish" },
    { id: "other-export-crops-exporters-in-sri-lanka", label: "Other Export Crops" },
    { id: "other-products-exporters-in-sri-lanka", label: "Other Manufactured Products" },
    { id: "ppe", label: "Personal Protective Equipment (PPE)" },
    {
      id: "printing-and-stationery-exporters-in-sri-lanka",
      label: "Printing, Prepress and Packaging",
    },
    { id: "rubber-exporters-in-sri-lanka", label: "Rubber & Rubber Based Products" },
    { id: "spices-exporters-in-sri-lanka", label: "Spices, Essential Oils & Oleoresins" },
    { id: "tea-exporters-in-sri-lanka", label: "Tea" },
    { id: "tobacco-exporters-in-sri-lanka", label: "Tobacco" },
    { id: "wooden-product-exporters-in-sri-lanka", label: "Wood & Wooden Products" },
  ];
  
  /**
   * SUB-CATEGORIES for each main category.
   * KEY MUST MATCH the `id` value from productCategories above.
   */
  export const subcategoriesByCategory: Record<string, string[]> = {
    "apparel-exporters-in-sri-lanka": [
      "Knitted garments",
      "Woven garments",
      "Sportswear / Activewear",
      "Lingerie & intimate apparel",
      "Children’s wear",
      "Workwear / uniforms",
    ],
  
    "ayurvedic-herbal": [
      "Ayurvedic medicines",
      "Herbal cosmetics & skin care",
      "Herbal food supplements",
      "Herbal teas & beverages",
      "Essential oils & extracts",
    ],
  
    "boat-ship-building-exporters-in-sri-lanka": [
      "Leisure boats",
      "Fishing boats",
      "Patrol / service craft",
      "Boat repair & maintenance",
    ],
  
    "ceramics-porcelain-products-manufacturers": [
      "Tableware",
      "Tiles",
      "Sanitary ware",
      "Ornamental ceramics",
    ],
  
    "chemicals-and-plastic-products-exporters": [
      "Industrial chemicals",
      "Paints & coatings",
      "Plastics raw material",
      "Plastic household items",
      "Plastic packaging",
    ],
  
    "coconut-product-exporters-in-sri-lanka": [
      "Desiccated coconut",
      "Virgin coconut oil",
      "Coconut milk / cream",
      "Coconut water",
      "Coconut based snacks",
      "Coconut fibre & coir products",
    ],
  
    "floriculture-exporters-in-sri-lanka": [
      "Fresh cut flowers",
      "Potted plants",
      "Foliage & greens",
      "Tissue-culture plants",
    ],
  
    "gem-diamond-and-jewellery-exporters-in-sri-lanka": [
      "Loose gemstones",
      "Diamond jewellery",
      "Gold jewellery",
      "Silver jewellery",
      "Custom jewellery design",
    ],
  
    "electrical-electronic-products-exporters-in-sri-lanka": [
      "Automatic data processing machines",
      "Cables & wiring",
      "Electrical switchgear & panels",
      "Household electrical appliances",
      "Electronic components & assemblies",
    ],
  
    "engineering-products-exporters-in-sri-lanka": [
      "Machinery & equipment",
      "Metal fabrications",
      "Agricultural machinery",
      "Precision engineering components",
    ],
  
    "fish-fisheries-product-exporters-in-sri-lanka": [
      "Fresh fish",
      "Frozen fish",
      "Canned fish",
      "Processed seafood",
      "Value-added seafood products",
    ],
  
    "food-and-beverages-exporters-in-sri-lanka": [
      "Processed food",
      "Confectionery & bakery products",
      "Ready-to-eat meals",
      "Animal feed",
      "Non-alcoholic beverages",
    ],
  
    "footwear-parts-exporters-in-sri-lanka": [
      "Leather footwear",
      "Rubber / synthetic footwear",
      "Industrial safety shoes",
      "Soles & footwear components",
    ],
  
    "fruits-nuts-vegetables-exporters-in-sri-lanka": [
      "Fresh fruits",
      "Fresh vegetables",
      "Processed fruit products",
      "Dried fruits",
      "Nuts & kernels",
    ],
  
    "giftware-and-toys-exporters-in-sri-lanka": [
      "Handicrafts",
      "Wooden toys",
      "Soft toys",
      "Corporate gifts",
      "Souvenirs",
    ],
  
    "leather-products-exporters-in-sri-lanka": [
      "Leather bags & accessories",
      "Leather garments",
      "Small leather goods",
      "Leather industrial products",
    ],
  
    "light-engineering-services-sri-lanka": [
      "Metalworking services",
      "Fabrication & welding",
      "Tooling & dies",
      "Light machinery",
    ],
  
    "non-metallic-mineral-products-exporters-in-sri-lanka": [
      "Industrial minerals",
      "Mineral-based chemicals",
      "Processed mineral products",
    ],
  
    "organic-products-exporters-in-sri-lanka": [
      "Organic spices",
      "Organic tea",
      "Organic coconut products",
      "Organic fruits & vegetables",
    ],
  
    "aquarium-fish": [
      "Freshwater ornamental fish",
      "Marine ornamental fish",
      "Aquarium plants",
      "Aquarium accessories & equipment",
    ],
  
    "other-export-crops-exporters-in-sri-lanka": [
      "Minor export crops",
      "Herbs & botanicals",
      "Specialty crop products",
    ],
  
    "other-products-exporters-in-sri-lanka": [
      "Household goods",
      "Stationery & office items",
      "Miscellaneous manufactured items",
    ],
  
    ppe: [
      "Face masks",
      "Gloves",
      "Protective clothing",
      "Hospital & medical PPE",
      "Industrial PPE",
    ],
  
    "printing-and-stationery-exporters-in-sri-lanka": [
      "Flexible packaging",
      "Cartons & boxes",
      "Labels & stickers",
      "Books & publications",
      "Commercial printing",
    ],
  
    "rubber-exporters-in-sri-lanka": [
      "Industrial rubber products",
      "Rubber tyres & tubes",
      "Rubber gloves",
      "Rubber mats & floor coverings",
      "Technical rubber components",
    ],
  
    "spices-exporters-in-sri-lanka": [
      "Cinnamon",
      "Pepper",
      "Cloves",
      "Cardamom",
      "Nutmeg & mace",
      "Spice mixes",
      "Essential oils & oleoresins",
    ],
  
    "tea-exporters-in-sri-lanka": [
      "Bulk black tea",
      "Bulk green tea",
      "Packeted tea",
      "Tea bags",
      "Specialty / flavoured tea",
    ],
  
    "tobacco-exporters-in-sri-lanka": [
      "Raw tobacco",
      "Processed tobacco",
      "Cigarettes",
      "Other tobacco products",
    ],
  
    "wooden-product-exporters-in-sri-lanka": [
      "Sawn timber",
      "Furniture & joinery",
      "Wooden household items",
      "Wooden toys & gift items",
    ],
  };
  