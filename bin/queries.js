// mongodb queries

use ffdb;

db.customer.insertMany([
  { id: 1928808001, name: "HBO", products: ["ai", "ei", "ci", "si"] },
  { id: 1928808002, name: "Sony", products: ["ai", "ei"] },
  { id: 1928808003, name: "Hulu", products: ["ai"] }
]);

db.product.insertMany([
  { id: "ai", name: "Ad Insights" },
  { id: "ei", name: "Experience Insights" },
  { id: "ci", name: "Content Insights" },
  { id: "si", name: "Social Insights" }
]);
