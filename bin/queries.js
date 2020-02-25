// mongodb queries

//use ffdb;

db.customer.insertMany([
  { id: 1928808001, name: "Alpha", products: ["pdt_arg", "pdt_znc", "pdt_ndy", "pdt_pln"] },
  { id: 1928808002, name: "Beta", products: ["pdt_arg", "pdt_znc"] },
  { id: 1928808003, name: "Gamma", products: ["pdt_arg"] }
]);

db.product.insertMany([
  { id: "pdt_arg", name: "Argon" },
  { id: "pdt_znc", name: "Zinc" },
  { id: "pdt_ndy", name: "Neodym" },
  { id: "pdt_pln", name: "Planar" }
]);

db.features.insertMany([
  {
    id: "ff_sso",
    name: "Single Sign-On",
    product: "pdt_arg",
    status: 0,
    description:
      "Enables Signle Sign on",
    attributes: []
  },
  {
    id: "ff_alerts",
    name: "Alerts",
    product: "pdt_arg",
    status: 0,
    attributes: [],
    description: "Enables Alerts tab and associated features"
  },
  {
    id: "ff_usage_report",
    name: "Usage Reports",
    product: "pdt_arg",
    status: 0,
    attributes: [],
    description: "Enables Usage Report dashboard"
  },
  {
    id: "ff_api_rl",
    name: "API Rate Limit",
    product: "pdt_arg",
    status: 0,
    attributes: [
      {
        _id: "5dd01042e578918c24d6a965",
        id: "nor",
        name: "No of requests(per day)",
        meta: {
          default: 200
        }
      }
    ],
    description: "Sets rate limit on the APIs"
  },
]);
