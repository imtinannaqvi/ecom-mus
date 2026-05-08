class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;      // Mongoose query (e.g., productModel.find())
    this.queryStr = queryStr; // URL parameters (e.g., req.query)
  }

  // 1. Search Logic (by name)
  search() {
    const keyword = this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,
        $options: "i", // Case-insensitive
      },
    } : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // 2. Filter Logic (for Category, Price, Color, Size)
  filter() {
    const queryCopy = { ...this.queryStr };

    // Fields to remove from filter (ye search ya pagination ke liye hain)
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Price Filter (Range: gte, lte)
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
}

module.exports = APIFeatures;