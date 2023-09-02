const Product = require("../models/product");

exports.findAll = async (req, res) => {
  const product = await Product.find().lean();
  res.json(product);
};

exports.add = async (req, res) => {
  const {
    category,
    img1,
    img2,
    img3,
    img4,
    long_desc,
    name,
    price,
    short_desc,
  } = req.body;
  try {
    if (!category || !img1 || !img2 || !name || typeof price == undefined) {
      res.json({
        message: "fill all",
      });
    } else {
      res.json({
        category: category,
        img1: img1,
        img2: img2,
        img3: img3,
        img4: img4,
        long_desc: long_desc,
        name: name,
        price: price,
        short_desc: short_desc,
      });
      Product.create({
        category,
        img1,
        img2,
        img3,
        img4,
        long_desc,
        name,
        price,
        short_desc,
      });
    }
  } catch (err) {
    res.send({ status: "err" });
  }
};

exports.paginatedProduct = async (req, res) => {
  const paginatedResults = (productArr, page, count) => {
    // calculating the starting and ending index
    const startIndex = (page - 1) * count;
    const endIndex = page * count;

    const results = {};
    if (endIndex < productArr.length) {
      results.next = {
        page: page + 1,
        count: count,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        count: count,
      };
    }

    results.results = productArr.slice(startIndex, endIndex);

    return results;
  };
  const { category, count, page, search } = req.query;

  const allProduct = search
    ? await Product.find({ name: { $regex: new RegExp(search, "i") } }).lean() //Tìm trong name có chứa chuỗi ký tự search
    : await Product.find().lean();
  const categoryProduct = await Product.find({
    category: { $regex: new RegExp(category, "i") },
  }).lean(); //Tìm bởi category không phân biệt in hoa in thường

  const result = paginatedResults(
    category == "all" ? allProduct : categoryProduct,
    page,
    count
  );
  res.json(result.results);
  // res.json(allProduct);
};

exports.detail = async (req, res) => {
  const id = req.params.tagId;
  console.log(id);
  const product = await Product.findOne({ _id: id }).lean();
  res.json(product);
};

// helper

const paginateQuery = async (mongoQuery, page, count) => {
  const skip = (page - 1) * count;
  const results = await mongoQuery.skip(skip).limit(count);
  // transform results the way you want and/or build response object
  return results;
};
