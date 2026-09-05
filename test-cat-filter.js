const BASE_URL = "https://ivanivanivan.vercel.app";

async function testCategoryFilter() {
  console.log("=== TESTING PRODUCT CATEGORY FILTER ===");

  const catIdWithProducts = "0d2d1838-3514-48f9-9ec2-53f39e234ae5";
  const catIdWithoutProducts = "8fa6f34f-b6e5-4da4-9ee9-4fbc40a60c8c";

  // 1. Filter category WITH products
  console.log(`\n1. Filtering products for category ID: '${catIdWithProducts}'...`);
  const res1 = await fetch(`${BASE_URL}/api/products?category_id=${catIdWithProducts}`);
  const data1 = await res1.json();
  console.log(`Result Count: ${data1.length}`);
  console.log("Data:", JSON.stringify(data1, null, 2));

  // 2. Filter category WITHOUT products
  console.log(`\n2. Filtering products for category ID: '${catIdWithoutProducts}'...`);
  const res2 = await fetch(`${BASE_URL}/api/products?category_id=${catIdWithoutProducts}`);
  const data2 = await res2.json();
  console.log(`Result Count: ${data2.length}`);
  console.log("Data:", JSON.stringify(data2, null, 2));

  if (data1.length > 0 && data2.length === 0) {
    console.log("\n✅ SUCCESS! Category filter works perfectly!");
  } else {
    console.log("\n❌ Filter check did not match expectation.");
  }
}

testCategoryFilter();
