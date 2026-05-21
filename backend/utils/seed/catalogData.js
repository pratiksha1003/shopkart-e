/**
 * Main categories, subcategories, and sample products for seeding.
 * Products are assigned to subcategory slugs.
 */

export const mainCategories = [
  { name: 'Home & Kitchen', slug: 'home-kitchen', order: 1, image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600', description: 'Cookware, decor, kitchen tools & home essentials' },
  { name: 'Men', slug: 'men', order: 2, image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600', description: 'Fashion, footwear & accessories for men' },
  { name: 'Women', slug: 'women', order: 3, image: 'https://images.unsplash.com/photo-1483985988350-763728e3685b?w=600', description: 'Trending styles, ethnic wear & more for women' },
  { name: 'Kids', slug: 'kids', order: 4, image: 'https://images.unsplash.com/photo-1503454537845-cef8a2b4c0e3?w=600', description: 'Clothing, toys & school essentials for kids' },
  { name: 'Electronics', slug: 'electronics', order: 5, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600', description: 'Phones, laptops, TVs & smart gadgets' },
  { name: 'Beauty', slug: 'beauty', order: 6, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', description: 'Skincare, makeup, hair care & fragrances' },
];

export const subcategories = {
  'home-kitchen': [
    { name: 'Cookware & Pans', slug: 'cookware-pans', order: 1, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', description: 'Pans, pots & cookware sets' },
    { name: 'Kitchen Tools', slug: 'kitchen-tools-utensils', order: 2, image: 'https://images.unsplash.com/photo-1556909175-9a0b9d0c8b1e?w=400', description: 'Spoons, spatulas, knives & utensils' },
    { name: 'Curtains & Decor', slug: 'curtains-home-decor', order: 3, image: 'https://images.unsplash.com/photo-1616046229476-99b153a8e0e2?w=400', description: 'Curtains, cushions & home decor' },
    { name: 'Mats & Storage', slug: 'floor-mats-storage', order: 4, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400', description: 'Floor mats, organizers & storage' },
  ],
  men: [
    { name: 'T-Shirts & Polos', slug: 'mens-tshirts-polos', order: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', description: 'Casual & formal tops for men' },
    { name: 'Jeans & Trousers', slug: 'mens-jeans-trousers', order: 2, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', description: 'Denim, chinos & formal trousers' },
    { name: "Men's Footwear", slug: 'mens-footwear', order: 3, image: 'https://images.unsplash.com/photo-1606107557195-0a09c0a081d1?w=400', description: 'Sneakers, formal shoes & sandals' },
    { name: 'Watches & Accessories', slug: 'mens-watches-accessories', order: 4, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', description: 'Watches, belts & wallets' },
  ],
  women: [
    { name: 'Dresses & Tops', slug: 'womens-dresses-tops', order: 1, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', description: 'Dresses, tops & western wear' },
    { name: 'Ethnic Wear', slug: 'womens-ethnic-wear', order: 2, image: 'https://images.unsplash.com/photo-1583292657328-7f2c9d4b1f4e?w=400', description: 'Kurtis, sarees & ethnic sets' },
    { name: "Women's Footwear", slug: 'womens-footwear', order: 3, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', description: 'Heels, flats & sports shoes' },
    { name: 'Handbags & Jewelry', slug: 'womens-handbags-jewelry', order: 4, image: 'https://images.unsplash.com/photo-1584917865442-de89d76ffd68?w=400', description: 'Bags, earrings & accessories' },
  ],
  kids: [
    { name: 'Boys Clothing', slug: 'boys-clothing', order: 1, image: 'https://images.unsplash.com/photo-1503454537845-cef8a2b4c0e3?w=400', description: 'Shirts, shorts & sets for boys' },
    { name: 'Girls Clothing', slug: 'girls-clothing', order: 2, image: 'https://images.unsplash.com/photo-1519238263530-99bdd2712eb7?w=400', description: 'Dresses, frocks & sets for girls' },
    { name: 'Toys & Games', slug: 'toys-games', order: 3, image: 'https://images.unsplash.com/photo-1558060379-3b6e23bc08f2?w=400', description: 'Educational toys & outdoor games' },
    { name: 'School Essentials', slug: 'school-essentials', order: 4, image: 'https://images.unsplash.com/photo-1588072432836-e270a12f3b24?w=400', description: 'Bags, bottles & stationery' },
  ],
  electronics: [
    { name: 'Mobiles & Tablets', slug: 'mobiles-tablets', order: 1, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', description: 'Smartphones & tablets' },
    { name: 'Laptops & Computers', slug: 'laptops-computers', order: 2, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', description: 'Laptops, monitors & accessories' },
    { name: 'Audio & Headphones', slug: 'audio-headphones', order: 3, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', description: 'Earbuds, speakers & headphones' },
    { name: 'TVs & Appliances', slug: 'tvs-appliances', order: 4, image: 'https://images.unsplash.com/photo-1593359677877-a751d1769022?w=400', description: 'Smart TVs & home appliances' },
  ],
  beauty: [
    { name: 'Skincare', slug: 'skincare', order: 1, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', description: 'Moisturizers, serums & sunscreens' },
    { name: 'Makeup', slug: 'makeup', order: 2, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', description: 'Lipstick, foundation & palettes' },
    { name: 'Hair Care', slug: 'hair-care', order: 3, image: 'https://images.unsplash.com/photo-1527799820377-dcf4620e3d64?w=400', description: 'Shampoo, oil & styling products' },
    { name: 'Fragrances', slug: 'fragrances', order: 4, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', description: 'Perfumes & body mists' },
  ],
};

/** Products keyed by subcategory slug */
export const productsBySubcategory = {
  'cookware-pans': [
    { name: 'Non-Stick Fry Pan 24cm', slug: 'non-stick-fry-pan-24', description: 'Induction-friendly non-stick fry pan with cool-touch handle.', brand: 'ChefHome', images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'], price: 899, comparePrice: 1499, countInStock: 80, isFeatured: true, rating: 4.5, numReviews: 210 },
    { name: 'Stainless Steel Cookware Set 10pc', slug: 'stainless-cookware-set-10', description: 'Premium 10-piece induction-compatible cookware with glass lids.', brand: 'ChefHome', images: ['https://images.unsplash.com/photo-1584990347499-4c1d0f6a8a0b?w=600'], price: 3499, comparePrice: 5499, countInStock: 40, rating: 4.4, numReviews: 167 },
    { name: 'Cast Iron Kadai 3L', slug: 'cast-iron-kadai-3l', description: 'Pre-seasoned cast iron kadai for authentic cooking.', brand: 'Heritage', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'], price: 1299, comparePrice: 1899, countInStock: 55, rating: 4.6, numReviews: 98 },
  ],
  'kitchen-tools-utensils': [
    { name: 'Silicone Spatula Set (5pc)', slug: 'silicone-spatula-set-5', description: 'Heat-resistant spatulas for non-stick cookware.', brand: 'KitchenPro', images: ['https://images.unsplash.com/photo-1556909175-9a0b9d0c8b1e?w=600'], price: 449, comparePrice: 699, countInStock: 120, rating: 4.3, numReviews: 145 },
    { name: 'Stainless Steel Spoon & Ladle Set', slug: 'steel-spoon-ladle-set', description: 'Durable serving spoons and ladles for everyday use.', brand: 'KitchenPro', images: ['https://images.unsplash.com/photo-1606858291829-1399a223ac0b?w=600'], price: 599, comparePrice: 899, countInStock: 90, rating: 4.2, numReviews: 88 },
    { name: 'Kitchen Knife Set with Block', slug: 'kitchen-knife-set-block', description: '6-piece sharp knife set with wooden storage block.', brand: 'SharpEdge', images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600'], price: 1999, comparePrice: 2999, countInStock: 45, isFeatured: true, rating: 4.7, numReviews: 312 },
  ],
  'curtains-home-decor': [
    { name: 'Blackout Window Curtains (2 Panels)', slug: 'blackout-curtains-2panel', description: 'Thermal insulated curtains, 7ft x 5ft per panel.', brand: 'HomeStyle', images: ['https://images.unsplash.com/photo-1616046229476-99b153a8e0e2?w=600'], price: 1499, comparePrice: 2499, countInStock: 60, rating: 4.4, numReviews: 176 },
    { name: 'Decorative Cushion Covers (Set of 4)', slug: 'cushion-covers-set-4', description: 'Premium cotton cushion covers in modern prints.', brand: 'HomeStyle', images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2f2?w=600'], price: 699, comparePrice: 999, countInStock: 100, rating: 4.2, numReviews: 54 },
    { name: 'Wall Art Canvas Set (3pc)', slug: 'wall-art-canvas-3pc', description: 'Modern abstract canvas prints for living room decor.', brand: 'ArtNest', images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=600'], price: 2499, comparePrice: 3999, countInStock: 35, isFeatured: true, rating: 4.5, numReviews: 67 },
  ],
  'floor-mats-storage': [
    { name: 'Anti-Slip Kitchen Floor Mat', slug: 'anti-slip-kitchen-mat', description: 'Waterproof PVC mat with cushioned comfort.', brand: 'ComfortMat', images: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600'], price: 499, comparePrice: 799, countInStock: 150, rating: 4.3, numReviews: 203 },
    { name: 'Bamboo Bath Mat', slug: 'bamboo-bath-mat', description: 'Eco-friendly slatted bamboo mat for bathroom.', brand: 'ComfortMat', images: ['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600'], price: 799, comparePrice: 1199, countInStock: 70, rating: 4.4, numReviews: 89 },
    { name: 'Stackable Storage Containers (12pc)', slug: 'storage-containers-12pc', description: 'Airtight BPA-free containers for pantry organization.', brand: 'OrganizeIt', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], price: 1299, comparePrice: 1999, countInStock: 65, rating: 4.6, numReviews: 134 },
  ],
  'mens-tshirts-polos': [
    { name: 'Men Cotton Round Neck T-Shirt', slug: 'men-cotton-tshirt', description: '100% cotton breathable tee in multiple colors.', brand: 'UrbanStyle', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'], price: 599, comparePrice: 999, countInStock: 200, rating: 4.2, numReviews: 456 },
    { name: 'Men Polo Shirt Slim Fit', slug: 'men-polo-slim-fit', description: 'Classic polo with ribbed collar, office & casual wear.', brand: 'UrbanStyle', images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc457d?w=600'], price: 899, comparePrice: 1399, countInStock: 120, isFeatured: true, rating: 4.4, numReviews: 189 },
  ],
  'mens-jeans-trousers': [
    { name: 'Men Slim Fit Blue Jeans', slug: 'men-slim-jeans-blue', description: 'Stretch denim jeans with modern slim fit.', brand: 'DenimCo', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'], price: 1499, comparePrice: 2499, countInStock: 90, rating: 4.5, numReviews: 278 },
    { name: 'Men Formal Trousers', slug: 'men-formal-trousers', description: 'Wrinkle-resistant formal trousers for office wear.', brand: 'FormalLine', images: ['https://images.unsplash.com/photo-1473966968600-fa801b279a01?w=600'], price: 1299, comparePrice: 1999, countInStock: 75, rating: 4.3, numReviews: 112 },
  ],
  'mens-footwear': [
    { name: 'Men Running Sneakers', slug: 'men-running-sneakers', description: 'Lightweight mesh sneakers with cushioned sole.', brand: 'RunFast', images: ['https://images.unsplash.com/photo-1606107557195-0a09c0a081d1?w=600'], price: 2499, comparePrice: 3999, countInStock: 80, isFeatured: true, rating: 4.6, numReviews: 312 },
    { name: 'Men Leather Formal Shoes', slug: 'men-leather-formal-shoes', description: 'Genuine leather lace-up shoes for formal occasions.', brand: 'ClassicStep', images: ['https://images.unsplash.com/photo-1614252239476-9b8c7a9b0b0a?w=600'], price: 2999, comparePrice: 4499, countInStock: 50, rating: 4.5, numReviews: 145 },
  ],
  'mens-watches-accessories': [
    { name: 'Men Analog Stainless Watch', slug: 'men-analog-watch', description: 'Water-resistant watch with leather strap.', brand: 'TimeCraft', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'], price: 1999, comparePrice: 3499, countInStock: 60, rating: 4.4, numReviews: 198 },
    { name: 'Men Leather Belt & Wallet Combo', slug: 'men-belt-wallet-combo', description: 'Genuine leather belt and bi-fold wallet gift set.', brand: 'ClassicStep', images: ['https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600'], price: 1299, comparePrice: 1999, countInStock: 85, rating: 4.3, numReviews: 76 },
  ],
  'womens-dresses-tops': [
    { name: 'Women Floral Maxi Dress', slug: 'women-floral-maxi-dress', description: 'Flowy summer maxi dress with adjustable straps.', brand: 'StyleAura', images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'], price: 1599, comparePrice: 2599, countInStock: 70, isFeatured: true, rating: 4.6, numReviews: 234 },
    { name: 'Women Crop Top Pack (3)', slug: 'women-crop-top-pack', description: 'Trendy cotton crop tops in assorted colors.', brand: 'StyleAura', images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600'], price: 999, comparePrice: 1499, countInStock: 95, rating: 4.2, numReviews: 87 },
  ],
  'womens-ethnic-wear': [
    { name: 'Women Printed Kurti', slug: 'women-printed-kurti', description: 'Cotton kurti with mandala print, festive & casual.', brand: 'EthnicWeave', images: ['https://images.unsplash.com/photo-1583292657328-7f2c9d4b1f4e?w=600'], price: 899, comparePrice: 1499, countInStock: 110, rating: 4.5, numReviews: 312 },
    { name: 'Women Silk Saree', slug: 'women-silk-saree', description: 'Elegant banarasi-style saree with blouse piece.', brand: 'EthnicWeave', images: ['https://images.unsplash.com/photo-1610030469667-1a41649a7815?w=600'], price: 3999, comparePrice: 6999, countInStock: 30, isFeatured: true, rating: 4.8, numReviews: 156 },
  ],
  'womens-footwear': [
    { name: 'Women Running Shoes', slug: 'women-running-shoes', description: 'Lightweight mesh upper with cushioned sole.', brand: 'RunFast', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'], price: 2499, comparePrice: 3999, countInStock: 80, isFeatured: true, rating: 4.6, numReviews: 312 },
    { name: 'Women Block Heel Sandals', slug: 'women-block-heel-sandals', description: 'Comfortable block heels for parties & weddings.', brand: 'StepUp', images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600'], price: 1799, comparePrice: 2799, countInStock: 55, rating: 4.4, numReviews: 98 },
  ],
  'womens-handbags-jewelry': [
    { name: 'Women Tote Handbag', slug: 'women-tote-handbag', description: 'Spacious faux-leather tote with inner pockets.', brand: 'BagLane', images: ['https://images.unsplash.com/photo-1584917865442-de89d76ffd68?w=600'], price: 1499, comparePrice: 2499, countInStock: 65, rating: 4.3, numReviews: 167 },
    { name: 'Women Gold-Plated Earrings Set', slug: 'women-earrings-set', description: 'Hypoallergenic earrings set of 6 pairs.', brand: 'Sparkle', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'], price: 699, comparePrice: 1199, countInStock: 140, rating: 4.5, numReviews: 245 },
  ],
  'boys-clothing': [
    { name: 'Boys Graphic T-Shirt Pack', slug: 'boys-graphic-tshirt-pack', description: 'Cotton tees with fun prints, pack of 3.', brand: 'KidJoy', images: ['https://images.unsplash.com/photo-1503454537845-cef8a2b4c0e3?w=600'], price: 799, comparePrice: 1199, countInStock: 100, rating: 4.4, numReviews: 89 },
    { name: 'Boys Denim Shorts', slug: 'boys-denim-shorts', description: 'Adjustable waist denim shorts for ages 4-12.', brand: 'KidJoy', images: ['https://images.unsplash.com/photo-1519238263530-99bdd2712eb7?w=600'], price: 699, comparePrice: 999, countInStock: 85, rating: 4.2, numReviews: 45 },
  ],
  'girls-clothing': [
    { name: 'Girls Party Frock', slug: 'girls-party-frock', description: 'Sparkly party dress with bow detail.', brand: 'LittleStar', images: ['https://images.unsplash.com/photo-1519238263530-99bdd2712eb7?w=600'], price: 1299, comparePrice: 1999, countInStock: 60, isFeatured: true, rating: 4.6, numReviews: 112 },
    { name: 'Girls Leggings Pack (3)', slug: 'girls-leggings-pack-3', description: 'Soft stretch leggings in pastel colors.', brand: 'LittleStar', images: ['https://images.unsplash.com/photo-1503919545889-ef09b5fb07de?w=600'], price: 599, comparePrice: 899, countInStock: 95, rating: 4.3, numReviews: 67 },
  ],
  'toys-games': [
    { name: 'Building Blocks Set 100pc', slug: 'building-blocks-100pc', description: 'Colorful educational blocks for creative play.', brand: 'PlayLearn', images: ['https://images.unsplash.com/photo-1558060379-3b6e23bc08f2?w=600'], price: 899, comparePrice: 1399, countInStock: 120, rating: 4.7, numReviews: 234 },
    { name: 'Remote Control Racing Car', slug: 'rc-racing-car', description: 'High-speed RC car with rechargeable battery.', brand: 'PlayLearn', images: ['https://images.unsplash.com/photo-1555622434-49f4c4c0e8e1?w=600'], price: 1499, comparePrice: 2299, countInStock: 50, isFeatured: true, rating: 4.5, numReviews: 178 },
  ],
  'school-essentials': [
    { name: 'Kids School Backpack', slug: 'kids-school-backpack', description: 'Ergonomic backpack with padded straps & lunch pocket.', brand: 'StudyPack', images: ['https://images.unsplash.com/photo-1588072432836-e270a12f3b24?w=600'], price: 999, comparePrice: 1599, countInStock: 80, rating: 4.4, numReviews: 145 },
    { name: 'Insulated Water Bottle 500ml', slug: 'kids-water-bottle-500', description: 'BPA-free bottle keeps drinks cold for 12 hours.', brand: 'HydroKid', images: ['https://images.unsplash.com/photo-1602143407151-aa2847dd7c0f?w=600'], price: 449, comparePrice: 699, countInStock: 200, rating: 4.3, numReviews: 98 },
  ],
  'mobiles-tablets': [
    { name: 'Smartphone 128GB', slug: 'smartphone-128gb', description: '6.5" AMOLED display, 50MP camera, 5000mAh battery.', brand: 'TechOne', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'], price: 18999, comparePrice: 24999, countInStock: 40, isFeatured: true, rating: 4.5, numReviews: 890 },
    { name: 'Android Tablet 10"', slug: 'android-tablet-10', description: 'Full HD tablet for study, work & entertainment.', brand: 'TechOne', images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'], price: 12999, comparePrice: 16999, countInStock: 35, rating: 4.3, numReviews: 234 },
  ],
  'laptops-computers': [
    { name: 'Ultrabook Laptop 16GB RAM', slug: 'ultrabook-laptop-16gb', description: 'Intel i5, 512GB SSD, 14" FHD display.', brand: 'ComputeX', images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'], price: 54999, comparePrice: 69999, countInStock: 20, isFeatured: true, rating: 4.6, numReviews: 456 },
    { name: 'Wireless Mouse & Keyboard Combo', slug: 'wireless-mouse-keyboard', description: 'Ergonomic combo with long battery life.', brand: 'ComputeX', images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'], price: 1999, comparePrice: 2999, countInStock: 90, rating: 4.4, numReviews: 312 },
  ],
  'audio-headphones': [
    { name: 'Wireless Bluetooth Headphones', slug: 'wireless-bluetooth-headphones', description: 'Noise-cancelling over-ear with 30hr battery.', brand: 'SoundMax', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'], price: 2999, comparePrice: 4999, countInStock: 50, isFeatured: true, rating: 4.5, numReviews: 128 },
    { name: 'True Wireless Earbuds', slug: 'true-wireless-earbuds', description: 'ENC mic, 24hr total playtime with case.', brand: 'SoundMax', images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'], price: 1499, comparePrice: 2499, countInStock: 100, rating: 4.3, numReviews: 567 },
  ],
  'tvs-appliances': [
    { name: '4K Ultra HD Smart TV 55"', slug: '4k-smart-tv-55', description: 'Android TV with Dolby Vision & streaming apps.', brand: 'ViewPro', images: ['https://images.unsplash.com/photo-1593359677877-a751d1769022?w=600'], price: 42999, comparePrice: 54999, countInStock: 15, isFeatured: true, rating: 4.7, numReviews: 234 },
    { name: 'Robot Vacuum Cleaner', slug: 'robot-vacuum', description: 'Smart mapping, app control, 2000Pa suction.', brand: 'CleanBot', images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600'], price: 12999, comparePrice: 18999, countInStock: 25, rating: 4.5, numReviews: 98 },
  ],
  skincare: [
    { name: 'Vitamin C Face Serum', slug: 'vitamin-c-serum', description: 'Brightening serum with 20% vitamin C complex.', brand: 'GlowLab', images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'], price: 699, comparePrice: 999, countInStock: 150, isFeatured: true, rating: 4.6, numReviews: 890 },
    { name: 'SPF 50 Sunscreen Gel', slug: 'spf50-sunscreen-gel', description: 'Lightweight non-greasy UVA/UVB protection.', brand: 'GlowLab', images: ['https://images.unsplash.com/photo-1620916563098-4c4b4b4b4b4b?w=600'], price: 499, comparePrice: 749, countInStock: 200, rating: 4.5, numReviews: 456 },
  ],
  makeup: [
    { name: 'Matte Lipstick Set (6 Shades)', slug: 'matte-lipstick-set-6', description: 'Long-lasting matte lipsticks in trending shades.', brand: 'GlamFit', images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600'], price: 899, comparePrice: 1399, countInStock: 120, rating: 4.4, numReviews: 678 },
    { name: 'HD Foundation + Brush Kit', slug: 'hd-foundation-brush-kit', description: 'Full coverage foundation with blending brush.', brand: 'GlamFit', images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54c51?w=600'], price: 1299, comparePrice: 1999, countInStock: 85, rating: 4.3, numReviews: 234 },
  ],
  'hair-care': [
    { name: 'Keratin Hair Shampoo 400ml', slug: 'keratin-shampoo-400', description: 'Sulfate-free shampoo for smooth, frizz-free hair.', brand: 'SilkStrand', images: ['https://images.unsplash.com/photo-1527799820377-dcf4620e3d64?w=600'], price: 399, comparePrice: 599, countInStock: 180, rating: 4.4, numReviews: 567 },
    { name: 'Argan Oil Hair Serum', slug: 'argan-oil-hair-serum', description: 'Nourishing serum for shine and split-end repair.', brand: 'SilkStrand', images: ['https://images.unsplash.com/photo-1608248543809-8b1d4f0a1b1b?w=600'], price: 549, comparePrice: 849, countInStock: 140, rating: 4.5, numReviews: 312 },
  ],
  fragrances: [
    { name: 'Eau de Parfum 100ml', slug: 'eau-de-parfum-100ml', description: 'Long-lasting floral woody fragrance for daily wear.', brand: 'ScentLux', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'], price: 2499, comparePrice: 3999, countInStock: 60, isFeatured: true, rating: 4.6, numReviews: 445 },
    { name: 'Body Mist Gift Set (3)', slug: 'body-mist-gift-set-3', description: 'Light fresh body mists in assorted fragrances.', brand: 'ScentLux', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600'], price: 999, comparePrice: 1499, countInStock: 90, rating: 4.3, numReviews: 178 },
  ],
};
