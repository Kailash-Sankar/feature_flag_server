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
    name: "Slates",
    product: "ai",
    status: 0,
    description:
      "Enables Slate duration and plays metric in analysis dashboard",
    attributes: []
  },
  {
    id: "ad_ai_alerts",
    name: "AI Alerts",
    product: "ai",
    status: 0,
    attributes: [],
    description: "Enables AI alers tab and associated features"
  },
  {
    id: "ai_new_dashboard",
    name: "New Dashboards",
    product: "ai",
    status: 0,
    attributes: [],
    description: "Enable new card based UI for analysis dashboard"
  },
  {
    id: "ai_revenue_loss",
    name: "Estimated Revenue Loss",
    product: "ai",
    status: 0,
    attributes: [
      {
        _id: "5dd01042e578918c24d6a965",
        id: "cpm",
        name: "Average CPM",
        meta: {
          default: 20
        }
      }
    ],
    description: "Enable Ad Revenue Loss on analysis dashboard"
  },
  {
    id: "ei_cam_api",
    name: "CAM APIs",
    product: "ei",
    status: 0,
    attributes: [
      {
        id: "rate_limit",
        name: "Rate Limit",
        type: "number",
        meta: { min: 10, max: 500 }
      }
    ],
    description: "Open CAM APIs for external requests"
  }
]);
