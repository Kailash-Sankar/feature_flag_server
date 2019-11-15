var express = require("express");
const FeatureController = require("../controllers/FeatureController");

var router = express.Router();

// meta data
router.get("/meta/customers/", FeatureController.customerList);
router.get("/meta/customer/:id", FeatureController.customerDetail);

// APIs that can be exposed (pending formatting)
router.get("/customer/:product/:id", FeatureController.customerFeatures);
router.post("/customer/:id", FeatureController.CustomerFeatureStore);

// feature management
router.post("/ff/", FeatureController.FeatureStore);

router.put("/:id", FeatureController.bookUpdate);
router.delete("/:id", FeatureController.bookDelete);

module.exports = router;
