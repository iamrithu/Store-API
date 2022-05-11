const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort(" price");
  res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
  const { featured, name, company, sort } = req.query;
  const queryObject = {};
  if (featured) queryObject.featured = featured === "true" ? true : false;
  if (name) queryObject.name = { $regex: name, $options: "i" };
  if (company) queryObject.company = company;
  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  }

  result = result.sort("createdAt");
  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
