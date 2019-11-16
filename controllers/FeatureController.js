const Customer = require("../models/CustomerModel");
const Feature = require("../models/FeatureModel");
const CustomerFeature = require("../models/CustomerFeatureModel");
const Product = require("../models/ProductModel");
const Audit = require("../models/AuditModel");

const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Feature Schema
function FeatureData(data) {
  this.id = data.id;
  this.name = data.name;
  this.product = data.product;
  this.updatedAt = data.updatedAt;
}

// handle generic errors
const valErrorHandler = (res, errors) =>
  apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());

// filter response by product
const filterByProduct = (obj, product) => {
  if (product === "all") return obj;

  const newObj = {};
  newObj.id = obj.id;
  newObj.name = obj.name;
  newObj.features = obj.features.filter(row => {
    return row.product == product;
  });
  return newObj;
};

// build features for a customer
// replaces product features and merges with existing ones
const buildFeaturesList = (currentFeatures, newFeatures, product) => {
  console.log("product", product);
  console.log(currentFeatures, newFeatures);

  const features = currentFeatures.filter(cf => cf.product !== product);
  features.push(...newFeatures.filter(nf => nf.product == product));
  return features;
};

// returns list of customers
exports.customerList = [
  //auth,
  function(req, res) {
    try {
      Customer.find({}, { _id: 0 }).then(customers => {
        console.log("customers", customers);
        if (customers.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            customers
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            []
          );
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

// returns list of products
exports.productList = [
  //auth,
  function(req, res) {
    try {
      Product.find({}, { _id: 0 }).then(products => {
        if (products.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            products
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            []
          );
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

// returns list of products
exports.featureList = [
  //auth,
  function(req, res) {
    try {
      Feature.find({ product: req.params.product }, { _id: 0 }).then(
        features => {
          if (features.length > 0) {
            return apiResponse.successResponseWithData(
              res,
              "Operation success",
              features
            );
          } else {
            return apiResponse.successResponseWithData(
              res,
              "Operation success",
              []
            );
          }
        }
      );
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

// returns details of a customer
exports.customerDetail = [
  // auth,
  function(req, res) {
    console.log("id", req.params.id);
    if (!req.params.id) {
      return apiResponse.successResponseWithData(res, "Operation success", {});
    }
    try {
      Customer.findOne({ id: req.params.id }, { _id: 0 }).then(customer => {
        console.log("c", customer);
        if (customer !== null) {
          //let data = new BookData(customer);
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            customer
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            {}
          );
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

// create a new feature
exports.FeatureStore = [
  //auth,
  body("id", "ID must not be empty.")
    .isLength({ min: 1 })
    .trim()
    .custom((value, { req }) => {
      return Feature.findOne({ id: value }).then(feature => {
        if (feature) {
          return Promise.reject("This feature already exists.");
        }
      });
    }),
  body("name", "Name must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("product", "Product must not be empty")
    .isLength({ min: 1 })
    .trim(),
  //sanitizeBody("*").escape(),
  (req, res) => {
    console.log("attr", req.body.attributes[0]);
    try {
      const errors = validationResult(req);
      console.log("errors", errors);
      let feature = new Feature({
        id: req.body.id,
        name: req.body.name,
        product: req.body.product,
        attributes: req.body.attributes
      });
      console.log("feature post", feature);

      if (!errors.isEmpty()) {
        return valErrorHandler(res, errors);
      } else {
        //Save feature
        feature.save(function(err) {
          if (err) {
            return apiResponse.ErrorResponse(res, err);
          }
          let fData = new FeatureData(feature);
          return apiResponse.successResponseWithData(
            res,
            "Feature added Successfully.",
            fData
          );
        });
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

// create customer => feature mapping
exports.CustomerFeatureStore = [
  //auth,
  // TODO: validations
  async (req, res) => {
    //console.log("CF Map", req.params, req.body.features[0]);

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return valErrorHandler(res, errors);
      }

      const customer = await Customer.findOne({ id: req.params.id });

      if (customer !== null) {
        // check if we already have a record in map collection
        let cfMap = await CustomerFeature.findOne({ id: customer.id });
        let auditRec = undefined;

        // update existing record
        if (cfMap) {
          // create record for audit
          auditRec = new Audit({
            key: Object.assign(
              {},
              { id: cfMap.id, name: cfMap.name, features: cfMap.features }
            )
          });

          cfMap.features = buildFeaturesList(
            cfMap.features,
            req.body.features,
            req.params.product
          );
        } else {
          // or create a new mapping record
          cfMap = new CustomerFeature({
            id: customer.id,
            name: customer.name,
            features: req.body.features
          });
        }

        console.log("customer", cfMap);

        // save mapping
        cfMap.save(err => {
          if (err) return apiResponse.ErrorResponse(res, err);

          // creat entry in audit
          // TODO: err handling here
          auditRec && auditRec.save();

          return apiResponse.successResponseWithData(
            res,
            "Features updated for customer.",
            cfMap
          );
        });
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Specified customer does not exist",
          {}
        );
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

// returns features of a customer
exports.customerFeatures = [
  // auth,
  (req, res) => {
    console.log("params", req.params);
    if (!req.params.id || !req.params.product) {
      return apiResponse.successResponseWithData(res, "Operation success", {});
    }
    try {
      let query = { id: req.params.id };
      CustomerFeature.findOne(query, { _id: 0, "features._id": 0 }).then(cf => {
        console.log("cf", cf);
        if (cf !== null) {
          let data = filterByProduct(cf, req.params.product);
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            data
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            {}
          );
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

// View audit records
exports.auditList = [
  //auth,
  (req, res) => {
    try {
      Audit.find({}, { _id: 0 })
        .sort({ updatedAt: -1 })
        .then(records => {
          if (records.length > 0) {
            return apiResponse.successResponseWithData(
              res,
              "Operation success",
              records
            );
          } else {
            return apiResponse.successResponseWithData(
              res,
              "Operation success",
              []
            );
          }
        });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

/**
 * Book Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.bookDelete = [
  auth,
  function(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      Book.findById(req.params.id, function(err, foundBook) {
        if (foundBook === null) {
          return apiResponse.notFoundResponse(
            res,
            "Book not exists with this id"
          );
        } else {
          //Check authorized user
          if (foundBook.user.toString() !== req.user._id) {
            return apiResponse.unauthorizedResponse(
              res,
              "You are not authorized to do this operation."
            );
          } else {
            //delete book.
            Book.findByIdAndRemove(req.params.id, function(err) {
              if (err) {
                return apiResponse.ErrorResponse(res, err);
              } else {
                return apiResponse.successResponse(res, "Book delete Success.");
              }
            });
          }
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  }
];
