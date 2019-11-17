var express = require("express");
const FeatureController = require("../controllers/FeatureController");

var router = express.Router();

// meta data
router.get("/meta/customers/", FeatureController.customerList);
router.get("/meta/customer/:id", FeatureController.customerDetail);
router.get("/meta/products/", FeatureController.productList);
router.get("/meta/features/:product", FeatureController.featureList);

// audit
router.post("/audit/", FeatureController.auditList);

// APIs that can be exposed (pending formatting)
router.get("/customer/:id/:product", FeatureController.customerFeatures);
router.post("/customer/:id/:product", FeatureController.CustomerFeatureStore);

// feature management
router.post("/ff/", FeatureController.FeatureStore);

// search
router.post("/search", FeatureController.search);

//router.delete("/:id", FeatureController.bookDelete);

module.exports = router;
