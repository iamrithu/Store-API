const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort(" price");
  res.status(200).json({ nbHits: products.length, products });
};

const getAllProducts = async (req, res) => {
  const { featured, name, company, sort, fields, numericFilters } = req.query;

  const queryObject = {};

  if (featured) queryObject.featured = featured === "true" ? true : false;
  if (name) queryObject.name = { $regex: name, $options: "i" };

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const reqExp = /\b(<|>|>=|=|<|<=)\b/g;

    const filters = numericFilters.replace(
      reqExp,
      (match) => `-${operatorMap[match]}-`
    );
    const option = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (option.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  if (company) queryObject.company = company;

  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  }

  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.sort("createdAt").skip(skip).limit(limit);
  const products = await result;
  res.status(200).json({ nbHits: products.length, products });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
