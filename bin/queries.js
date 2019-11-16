// mongodb queries

//use ffdb;

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

db.features.insertMany([
  {
    id: "ad_slates",
    name: "Ad Slates",
    product: "ai",
    attributes: []
  },
  {
    id: "ad_alerts",
    name: "Ad Alerts",
    product: "ai",
    attributes: []
  },
  {
    id: "ai_new_dashboard",
    name: "New Dashboards",
    product: "ai",
    attributes: []
  },
  {
    id: "ai_revenue_loss",
    name: "Estimated Revenue Loss",
    product: "ai",
    attributes: [
      {
        _id: "5dd01042e578918c24d6a965",
        id: "cpm",
        name: "Average CPM",
        meta: {
          default: 20
        }
      }
    ]
  }
]);
