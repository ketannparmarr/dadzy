import { InventoryDrop } from '../types';

export const DADZY_DROPS: InventoryDrop[] = [
  {
    id: 'drop-01',
    title: 'DROP 01: SILK POLOS & SARTORIAL ESSENTIALS',
    subtitle: 'An elite collection for the distinguished modern patriarch. Highly limited, individually serialized.',
    date: 'Active Now',
    status: 'active',
    products: [
      {
        id: 'p-01',
        name: 'The Atelier Silk-Cotton Polo',
        category: "Elite Knitwear",
        description: 'A masterpiece of casual refinement. Knitted from 18-gauge organic cotton and fine mulberry silk, offering a remarkably soft touch and a structured, elegant drape that flatters the senior physique.',
        price: 14500,
        image: '/src/assets/images/dad_lifestyle_polo.png',
        specs: [
          '55% Pure Mulberry Silk, 45% Organic Giza Cotton',
          'Highly breathable 18-gauge flat-knit mesh collar',
          'Seamless hand-linked shoulders for absolute comfort',
          'Slightly structured waist ribbing to retain shape'
        ],
        stock: 5,
        maxStock: 12,
        materials: ['Mulberry Silk', 'Organic Giza Cotton'],
        origin: 'Knitwear mills of Biella, Italy / Tailored in Jaipur',
        theme: 'Travel'
      },
      {
        id: 'p-02',
        name: 'The Tailored Blazer Jacket',
        category: "Couture Jackets",
        description: 'Sartorially cut from a premium linen-wool blend. Tailored with structured shoulders and a refined torso to deliver a clean, dignified silhouette for formal or leisure afternoons.',
        price: 32000,
        image: '/src/assets/images/dad_editorial_blazer.png',
        specs: [
          'High-grade Linen & Fine Virgin Wool blend',
          'Hand-stitched real horn button closure',
          'Sleek double-vented back for elegant mobility',
          'Premium satin lining for soft effortless layering'
        ],
        stock: 4,
        maxStock: 10,
        materials: ['Linen-Wool Blend', 'Real Horn Buttons', 'Premium Satin'],
        origin: 'Biella Woolen Mills, Italy / Crafted in Chennai Studio',
        theme: 'Occasion'
      },
      {
        id: 'p-03',
        name: 'The Sartorial Pleated Trouser',
        category: "Dad's Trousers",
        description: 'Double-pleated front with adjustable side tabs and a medium-rise waist, striking the perfect balance between timeless poise and modern ease.',
        price: 18500,
        image: '/src/assets/images/dad_pleated_trouser.png',
        specs: [
          '65% Italian Flax Linen, 35% Virgin Merino Wool',
          'Adjustable double-buckle steel side adjusters (no belt loops)',
          'After-dinner split-back waistband for organic flexibility',
          'Unfinished hems for custom sartorial length alterations'
        ],
        stock: 3,
        maxStock: 8,
        materials: ['Italian Flax', 'Virgin Merino Wool', 'Steel Hardware'],
        origin: 'Lanificio Cerruti Mills, Biella / Crafted in Mumbai Studio',
        theme: 'Occasion'
      },
      {
        id: 'p-04',
        name: 'The Mercerized Merino Polo',
        category: "Elite Knitwear",
        description: 'Sourced from extrafine Australian merino wool and mercerized cotton for a subtle, lustrous sheen that remains immaculate throughout active warm-weather days.',
        price: 16200,
        image: '/src/assets/images/dad_olive_polo.png',
        specs: [
          '70% Australian Extrafine Merino Wool, 30% Mercerized Cotton',
          'Three-button placket with real horn buttons',
          'Thermal-regulating self-cooling knit structure',
          'Ribbed cuffs and tailored hemline designed to be worn untucked'
        ],
        stock: 6,
        maxStock: 15,
        materials: ['Extrafine Merino Wool', 'Mercerized Cotton', 'Horn Buttons'],
        origin: 'Wool farms of Victoria, Australia / Knitted in Bangalore',
        theme: 'Travel'
      },
      {
        id: 'p-05',
        name: 'The Ivory Canvas Trouser',
        category: "Dad's Trousers",
        description: 'A crisp, double-weave cotton canvas trouser designed with hand-pressed front creases. It provides an impressive, structural silhouette that pairs flawlessly with any premium knit polo.',
        price: 15500,
        image: '/src/assets/images/dad_ivory_trouser.png',
        specs: [
          '100% Double-Weave Organic Cotton Canvas',
          'Hidden elastic waistband expansion tabs',
          'Hand-felled pocket bags and premium silk piping',
          'Deep back pockets with secure horn button tabs'
        ],
        stock: 2,
        maxStock: 6,
        materials: ['Organic Cotton Canvas', 'Real Horn Buttons'],
        origin: 'Cotton fields of Salem, Tamil Nadu / Crafted in Chennai Studio',
        theme: 'Travel'
      },
      {
        id: 'p-15',
        name: 'The Boardroom Cashmere Blazer',
        category: "Couture Jackets",
        description: 'Unstructured blazer jacket in ultra-fine Loro Piana cashmere. Tailored specifically with room at the waist and shoulders to provide business executives with executive authority and supreme comfort.',
        price: 84000,
        image: '/src/assets/images/dad_cashmere_blazer.png',
        specs: [
          '100% Pure Loro Piana Cashmere',
          'Silk lining detailing in dark burgundy',
          'Real mother-of-pearl buttons',
          'Internal ticket pocket and passport vault'
        ],
        stock: 3,
        maxStock: 5,
        materials: ['Loro Piana Cashmere', 'Pure Silk Lining'],
        origin: 'Biella Mills, Italy / Hand-tailored in Chennai Studio',
        theme: 'Business'
      },
      {
        id: 'p-06',
        name: 'The Sovereign Poplin Shirt',
        category: "Dad's Shirts",
        description: 'A sleek, long-sleeved dress shirt crafted from dense Giza 87 cotton poplin, dyed in dark charcoal. Tailored with a stiff mandarin collar that frames the neck.',
        price: 13500,
        image: '/src/assets/images/dad_classic_shirt.png',
        specs: [
          '100% Egyptian Giza 87 Cotton Poplin',
          'Rigid mandarin-style structured collar',
          'Clean hidden placket with mother-of-pearl buttons',
          'French cuffs for optional cufflink styling'
        ],
        stock: 0,
        maxStock: 15,
        materials: ['Giza Cotton Poplin', 'Mother-of-Pearl'],
        origin: 'Woven in Milan, Italy / Tailored in Varanasi Studio',
        theme: 'Business'
      },
      {
        id: 'p-08',
        name: 'The Royal Oxford Shirt',
        category: "Dad's Shirts",
        description: 'Structured dress shirt in French blue Royal Oxford weave. Designed with a generous body pattern and premium collar stays for a commanding boardroom look.',
        price: 15800,
        image: '/src/assets/images/dad_blue_shirt.png',
        specs: [
          '100% Sea Island Cotton, Royal Oxford weave',
          'Stiff spread collar with brass removable stays',
          'Signature single-needle tailoring',
          'Monogram ready cuffs'
        ],
        stock: 0,
        maxStock: 10,
        materials: ['Sea Island Cotton', 'Brass Hardware'],
        origin: 'West Indian Cotton Farms / Tailored in Jaipur Studio',
        theme: 'Business'
      }
    ]
  },
  {
    id: 'drop-02',
    title: 'DROP 02: SHADOW WOOL & LUXURY POPLINS',
    subtitle: 'An exploration of dark charcoal hues and architectural draping. Releasing mid-September.',
    date: 'Releasing Sept 15, 2026',
    status: 'upcoming',
    products: [
      {
        id: 'p-07',
        name: 'The Charcoal Travel Polo',
        category: "Elite Knitwear",
        description: 'Crafted from dense, high-gauge merino knit designed to repel creases. Engineered for long flights or executive boardrooms, offering unrivaled comfort with extreme poise.',
        price: 17800,
        image: '/src/assets/images/dad_charcoal_polo.png',
        specs: [
          '100% Anti-Crease Extrafine Australian Merino Wool',
          'Deep zipperless open collar (brutalist look)',
          'Extremely lightweight and self-deodorizing wool fibers',
          'Sleek double-knitted sleeve hems'
        ],
        stock: 0,
        maxStock: 12,
        materials: ['Australian Merino Wool'],
        origin: 'Sourced from Geelong, Australia / Hand-milled in Bengaluru',
        theme: 'Travel'
      },
      {
        id: 'p-09',
        name: 'The Tuscany Linen Shirt',
        category: "Dad's Shirts",
        description: 'An airy, sage green casual shirt cut from organic Italian flax linen. Pre-washed for superior softness and a relaxed look.',
        price: 16500,
        image: '/src/assets/images/dad_linen_shirt.png',
        specs: [
          '100% Organic Italian Flax Linen',
          'Pre-washed with volcanic pumice for vintage softness',
          'Breathable weave suited for tropical travel resorts',
          'Natural coconut shell buttons'
        ],
        stock: 0,
        maxStock: 15,
        materials: ['Organic Italian Flax Linen', 'Coconut Shell'],
        origin: 'Sourced from Florence, Italy / Tailored in Chennai Studio',
        theme: 'Travel'
      },
      {
        id: 'p-10',
        name: 'The Savile Row Trouser',
        category: "Dad's Trousers",
        description: 'Tailored trousers in midnight navy superfine worsted wool. Engineered with a customizable hidden flex waistband that adjusts dynamically.',
        price: 24000,
        image: '/src/assets/images/dad_navy_trouser.png',
        specs: [
          '100% Super 130s Worsted Merino Wool',
          'Internal rubber shirt grips on the inner waistband',
          'Discreet side zip-pockets for cards and coins',
          'Bemberg satin lining for friction-free movement'
        ],
        stock: 0,
        maxStock: 12,
        materials: ['Worsted Merino Wool', 'Bemberg Satin'],
        origin: 'Woven in Yorkshire, UK / Crafted in Mumbai Studio',
        theme: 'Business'
      },
      {
        id: 'p-11',
        name: 'The Monte Carlo Silk Trouser',
        category: "Dad's Trousers",
        description: 'A fluid champagne trouser cut from a pure silk and Belgian linen weave. Features double-pleated fronts and adjustable metal tabs.',
        price: 28500,
        image: '/src/assets/images/dad_silk_trouser.png',
        specs: [
          '50% Belgian Linen, 50% Mulberry Silk',
          'Adjustable double-buckle steel side tabs',
          'Elegantly draped front with relaxed crotch area',
          'Perfect for HNI sunset cocktail receptions'
        ],
        stock: 0,
        maxStock: 8,
        materials: ['Belgian Linen', 'Mulberry Silk'],
        origin: 'Woven in Courtrai, Belgium / Crafted in Mumbai Studio',
        theme: 'Occasion'
      },
      {
        id: 'p-12',
        name: 'The Imperial Dinner Jacket',
        category: "Couture Jackets",
        description: 'An unstructured shawl-collar dinner jacket in smoked silk jacquard. Features detailed floral patterns woven directly into the fabric.',
        price: 95000,
        image: '/src/assets/images/dad_dinner_jacket.png',
        specs: [
          '100% Woven Silk Jacquard',
          'Shawl collar in contrast black grosgrain silk',
          'Hand-rolled silk-covered lapel edges',
          'Dual back slits for fluid movement'
        ],
        stock: 0,
        maxStock: 6,
        materials: ['Woven Silk Jacquard', 'Grosgrain Silk'],
        origin: 'Woven in Lyon, France / Crafted in Varanasi Studio',
        theme: 'Occasion'
      },
      {
        id: 'p-13',
        name: 'The Executive Wool Waistcoat',
        category: "Couture Jackets",
        description: 'A premium six-button vest cut in charcoal herringbone wool. Designed to complement formal poplin shirts in boardroom scenarios.',
        price: 19500,
        image: '/src/assets/images/dad_wool_waistcoat.png',
        specs: [
          '100% Harris Tweed virgin wool',
          'Premium satin back panels with adjustable buckle',
          'Sleek welt watch pocket',
          'Hand-sewn horn buttons'
        ],
        stock: 0,
        maxStock: 10,
        materials: ['Harris Tweed Wool', 'Satin Backing'],
        origin: 'Sourced from Outer Hebrides, Scotland / Crafted in Jaipur Studio',
        theme: 'Business'
      },
      {
        id: 'p-14',
        name: 'The Grand Patriarch Sherwani',
        category: "Couture Jackets",
        description: 'An iconic bandhgala sherwani in pure handloom raw silk. Embossed with subtle tone-on-tone embroidery on the collar and button placket.',
        price: 110000,
        image: '/src/assets/images/dad_raw_silk_sherwani.png',
        specs: [
          '100% Handloom Raw Silk in gold-champagne hue',
          'Hand-embellished zardozi gold-thread details',
          'Concealed placket with customized inner silk lining',
          'Ventilation underarms for maximum comfort during occasions'
        ],
        stock: 0,
        maxStock: 5,
        materials: ['Handloom Raw Silk', 'Gold Zardozi Thread'],
        origin: 'Woven in Varanasi, UP / Tailored in Varanasi Studio',
        theme: 'Occasion'
      }
    ]
  }
];
