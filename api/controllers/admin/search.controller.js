const Admin = require("../../../models/admin.model");
const User = require("../../../efgecommerce/models/user/user");
const Category = require("../../../models/category.model");
const Category2 = require("../../../models/category2.model");
const SubCategory = require("../../../models/sub_category.model");
const SubCategory2 = require("../../../models/sub_category2.model");
const LeafCategory = require("../../../models/leaf_category.model");
const Element = require("../../../models/element.model");
const Element2 = require("../../../models/element2.model");
const Fabric = require("../../../models/fabric.model");
const Fabric2 = require("../../../models/fabric2.model");
const Size = require("../../../models/size.model");
const { HostURL } = require("../../helpers");
const FabricColors = require("../../../models/colors.models");
const FabricType = require("../../../models/types.model");
const FabricQuality = require("../../../models/quality.model");

// Search admin
const AdminSearch = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;
    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await Admin.find(
      {
        $and: [
          { _id: { $ne: req.user.id } },
          {
            $or: [
              { name: queryValue },
              { email: queryValue },
              { phone: queryValue },
            ],
          },
        ],
      },
      { name: 1, phone: 1, role: 1, status: 1, isOnline: 1, image: 1 }
    ).exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element.role) {
          items.push({
            _id: element._id,
            name: element.name,
            phone: element.phone,
            role: element.role,
            status: element.status,
            isOnline: element.isOnline,
            image: HostURL(req) + "uploads/admin/" + element.image,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Search user
const UserSearch = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await User.find({
      $and: [
        { _id: { $ne: req.user.id } },
        {
          $or: [
            { name: queryValue },
            { email: queryValue },
            { phone: queryValue },
          ],
        },
      ],
    }).exec();

    if (results && results.length) {
      results.map((item, index) => {
        if (item.image.length > 0) {
          results[index].image = "https://api.efgtailor.com" + item.image;
        }
      });
    }

    res.status(200).json({
      status: true,
      data: results,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Search category
const CategorySearch = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;
    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await Category.find({ title: queryValue })
      .populate("sub_categories", "title")
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            title: element.title,
            description: element.description,
            is_hidden: element.is_hidden,
            is_deleteable:
              element.sub_categories.length || element.leaf_categories.length
                ? false
                : true,
            title_image:
              HostURL(req) +
              "uploads/category/title_images/" +
              element.title_image,
            main_image:
              HostURL(req) +
              "uploads/category/main_images/" +
              element.main_image,
            sub_categories: element.sub_categories,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

const Category2Search = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;
    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await Category2.find({ title: queryValue })
      .populate("sub_categories", "title")
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            title: element.title,
            is_hidden: element.is_hidden,
            title_image:
              HostURL(req) +
              "uploads/category2/title_images/" +
              element.title_image,
            main_image:
              HostURL(req) +
              "uploads/category2/main_images/" +
              element.main_image,
            sub_categories: element.sub_categories,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Search sub-category
const SubCategorySearch = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;
    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await SubCategory.find({ title: queryValue })
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            title: element.title,
            description: element.description,
            is_hidden: element.is_hidden,
            is_deleteable:
              element.leaf_categories.length || element.elements.length
                ? false
                : true,
            title_image:
              HostURL(req) +
              "uploads/sub_category/title_images/" +
              element.title_image,
            main_image:
              HostURL(req) +
              "uploads/sub_category/main_images/" +
              element.main_image,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

const SubCategory2Search = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;
    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await SubCategory2.find({ title: queryValue })
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            title: element.title,
            is_hidden: element.is_hidden,
            main_image:
              HostURL(req) +
              "uploads/sub_category2/main_images/" +
              element.main_image,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Search leaf-category
const LeafCategorySearch = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;
    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await LeafCategory.find({ title: queryValue })
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            title: element.title,
            description: element.description,
            is_hidden: element.is_hidden,
            is_deleteable:
              element.elements.length || element.elements.length ? false : true,
            title_image:
              HostURL(req) +
              "uploads/leaf_category/title_images/" +
              element.title_image,
            main_image:
              HostURL(req) +
              "uploads/leaf_category/main_images/" +
              element.main_image,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Search element
const ElementSearch = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;
    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await Element.find(
      {
        $or: [{ title: queryValue }, { sub_title: queryValue }],
      },
      {
        title: 1,
        price: 1,
        is_hidden: 1,
        is_deleted: 1,
        is_default: 1,
        stock_status: 1,
        quality: 1,
        priority: 1,
        title_image: 1,
      }
    )
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        items.push({
          _id: element._id,
          title: element.title,
          price: element.price,
          is_hidden: element.is_hidden,
          is_default: element.is_default,
          is_deleted: element.is_deleted,
          stock_status: element.stock_status,
          quality: element.quality,
          priority: element.priority,
          title_image:
            HostURL(req) +
            "uploads/elements/title_images/" +
            element.title_image,
        });
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

const Element2Search = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;
    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await Element2.find(
      {
        $or: [{ title: queryValue }, { sub_title: queryValue }],
      },
      {
        title: 1,
        is_hidden: 1,
        is_deleted: 1,
        is_default: 1,
        priority: 1,
        title_image: 1,
      }
    )
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        items.push({
          _id: element._id,
          title: element.title,
          is_hidden: element.is_hidden,
          is_default: element.is_default,
          is_deleted: element.is_deleted,
          stock_status: element.stock_status,
          quality: element.quality,
          priority: element.priority,
          title_image:
            HostURL(req) +
            "uploads/elements2/title_images/" +
            element.title_image,
        });
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Search size
const SizeSearch = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await Size.find({ title: queryValue })
      .sort({ _id: -1 })
      .exec();

    res.status(200).json({
      status: true,
      data: results,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Search fabric
const FabricSearch = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;

    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await Fabric.find(
      {
        $or: [{ title: queryValue }, { sub_title: queryValue }],
      },
      {
        title: 1,
        sub_title: 1,
        original_price: 1,
        is_hidden: 1,
        is_default: 1,
        is_deleted: 1,
        stock_status: 1,
        title_image: 1,
      }
    )
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            title: element.title,
            sub_title: element.sub_title,
            original_price: element.original_price,
            is_hidden: element.is_hidden,
            is_default: element.is_default,
            is_deleted: element.is_deleted,
            stock_status: element.stock_status,
            title_image:
              HostURL(req) +
              "uploads/fabric/title_images/" +
              element.title_image,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

const Fabric2Search = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;

    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await Fabric2.find(
      {
        $or: [{ title: queryValue }],
      },
      {
        title: 1,
        original_price: 1,
        is_hidden: 1,
        is_default: 1,
        is_deleted: 1,
        stock_status: 1,
        main_image: 1,
      }
    )
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            title: element.title,
            original_price: element.original_price,
            is_hidden: element.is_hidden,
            is_default: element.is_default,
            is_deleted: element.is_deleted,
            stock_status: element.stock_status,
            main_image:
              HostURL(req) +
              "uploads/fabric2/main_images/" +
              element.main_image,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Search Colors
const ColorSearch = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;

    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await FabricColors.find({
      $or: [{ color: queryValue }],
    })
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            color: element.color,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Search Types
const TypeSearch = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;

    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await FabricType.find({
      $or: [{ type: queryValue }],
    })
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            type: element.type,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Search Quality
const QualitySearch = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;

    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    const queryValue = new RegExp(query, "i");
    const results = await FabricQuality.find({
      $or: [{ type: queryValue }],
    })
      .sort({ _id: -1 })
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            quality: element.quality,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

module.exports = {
  AdminSearch,
  UserSearch,
  CategorySearch,
  Category2Search,
  SubCategorySearch,
  SubCategory2Search,
  LeafCategorySearch,
  ElementSearch,
  Element2Search,
  SizeSearch,
  FabricSearch,
  Fabric2Search,
  ColorSearch,
  TypeSearch,
  QualitySearch,
};
