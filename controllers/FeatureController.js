const Customer = require("../models/CustomerModel");
const Feature = require("../models/FeatureModel");
const CustomerFeature = require("../models/CustomerFeatureModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Book Schema
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

// returns list of customers
exports.customerList = [
  //auth,
  function(req, res) {
    try {
      Customer.find({}, "id name products").then(customers => {
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

// returns details of a customer
exports.customerDetail = [
  // auth,
  function(req, res) {
    console.log("id", req.params.id);
    if (!req.params.id) {
      return apiResponse.successResponseWithData(res, "Operation success", {});
    }
    try {
      Customer.findOne({ id: req.params.id }, "id name products").then(
        customer => {
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
        }
      );
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
  sanitizeBody("*").escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      let feature = new Feature({
        id: req.body.id,
        name: req.body.name,
        product: req.body.product,
        params: req.body.params || []
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
  // TODO validations
  async (req, res) => {
    console.log("CF Map", req.params, req.body.features[0]);

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return valErrorHandler(res, errors);
      }

      const customer = await Customer.findOne({ id: req.params.id });

      if (customer !== null) {
        // check if we already have a record in map collection
        let cfMap = await CustomerFeature.findOne({ id: customer.id });

        // update existing record
        if (cfMap) {
          cfMap.features = req.body.features;
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
  function(req, res) {
    console.log("params", req.params);
    if (!req.params.id || !req.params.product) {
      return apiResponse.successResponseWithData(res, "Operation success", {});
    }
    try {
      let query = { id: req.params.id };
      CustomerFeature.findOne(query, "id name features").then(cf => {
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

/**
 * Book update.
 *
 * @param {string}      title
 * @param {string}      description
 * @param {string}      isbn
 *
 * @returns {Object}
 */
exports.bookUpdate = [
  auth,
  body("title", "Title must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("description", "Description must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("isbn", "ISBN must not be empty")
    .isLength({ min: 1 })
    .trim()
    .custom((value, { req }) => {
      return Book.findOne({
        isbn: value,
        user: req.user._id,
        _id: { $ne: req.params.id }
      }).then(book => {
        if (book) {
          return Promise.reject("Book already exist with this ISBN no.");
        }
      });
    }),
  sanitizeBody("*").escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      var book = new Book({
        title: req.body.title,
        description: req.body.description,
        isbn: req.body.isbn,
        _id: req.params.id
      });

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return apiResponse.validationErrorWithData(
            res,
            "Invalid Error.",
            "Invalid ID"
          );
        } else {
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
                //update book.
                Book.findByIdAndUpdate(req.params.id, book, {}, function(err) {
                  if (err) {
                    return apiResponse.ErrorResponse(res, err);
                  } else {
                    let bookData = new BookData(book);
                    return apiResponse.successResponseWithData(
                      res,
                      "Book update Success.",
                      bookData
                    );
                  }
                });
              }
            }
          });
        }
      }
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
