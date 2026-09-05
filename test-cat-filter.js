const BASE_URL = "https://ivanivanivan.vercel.app";

async function testCategoryFilter() {
  console.log("=== TESTING PRODUCT CATEGORY FILTER ===");

  // 1. Get categories
  const resCat = await fetch(`${BASE_URL}/api/categories`);
  const categories = await resCat.json();
  console.log("Categories:", categories);

  if (categories.length === 0) {
    console.log("No categories found.");
    return;
  }

  const catId = categories[0].id;
  console.log(`Filtering products by category_id: '${catId}' (${categories[0].name})...`);

  // 2. GET /api/products?category_id=...
  const resProd = await fetch(`${BASE_URL}/api/products?category_id=${catId}`);
  const filteredProducts = await resProd.json();
  console.log("Filtered Products Result:\n", JSON.stringify(filteredProducts, null, 2));
}

testCategoryFilter();
