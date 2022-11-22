const redis = require("redis");
const REDIS_PORT = process.env.REDIS_PORT;
const RedisClient = redis.createClient(REDIS_PORT);

// Category cache
const Category = async (req, res, next) => {
  try {
    const key = "categories";
    RedisClient.get(key, (error, results) => {
      if (results) {
        return res.status(200).json({
          status: true,
          data: JSON.parse(results),
        });
      } else {
        next();
      }
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Category cache
const CategoryType = async (req, res, next) => {
  try {
    const key = "category";
    RedisClient.get(key, (error, results) => {
      if (results) {
        return res.status(200).json({
          status: true,
          data: JSON.parse(results),
        });
      } else {
        next();
      }
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Sub category cache
const SubCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const key = "category-" + category;

    RedisClient.get(key, (error, result) => {
      if (result) {
        return res.status(200).json({
          status: true,
          data: JSON.parse(result),
        });
      } else {
        next();
      }
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Elements by main category
const ElementByMainCategory = async (req, res, next) => {
  try {
    const { main_category } = req.params;
    const key = "elements-" + main_category;

    RedisClient.get(key, (error, results) => {
      if (results) {
        return res.status(200).json({
          status: true,
          data: JSON.parse(results),
        });
      } else {
        next();
      }
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Default element
const DefaultElement = async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const key = "default-element-" + category_id;

    RedisClient.get(key, (error, result) => {
      if (result) {
        return res.status(200).json(JSON.parse(result));
      } else {
        next();
      }
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Sizes
const Sizes = async (req, res, next) => {
  try {
    const key = "sizes";
    RedisClient.get(key, (error, results) => {
      if (results) {
        return res.status(200).json({
          status: true,
          data: JSON.parse(results),
        });
      } else {
        next();
      }
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Backside elements
const BacSideElements = async (req, res, next) => {
  try {
    const { category } = req.params;
    const key = "backside-elements-" + category;

    RedisClient.get(key, (error, results) => {
      if (results) {
        return res.status(200).json(JSON.parse(results));
      } else {
        next();
      }
    });
  } catch (error) {
    if (error) next(error);
  }
};

module.exports = {
  RedisClient,
  Category,
  CategoryType,
  SubCategory,
  ElementByMainCategory,
  DefaultElement,
  Sizes,
  BacSideElements,
};
