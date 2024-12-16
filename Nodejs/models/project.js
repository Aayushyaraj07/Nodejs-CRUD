const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "project",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "title cannot be null",
        },
        notEmpty: {
          msg: "title cannot be empty",
        },
      },
    },
    // isFeatured: {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //   defaultValue: "false",
    //   validate: {
    //     isIn: {
    //       args: [["true", "false"]],
    //       msg: "isFeatured value must be true or false",
    //     },
    //   },
    // },
    productImage: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      validate: {
        notNull: {
          msg: "productImage cannot be null",
        },
        notEmpty: {
          msg: "productImage cannot be empty",
        },
      },
    },
    price: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "price cannot be null",
        },
        notEmpty: {
          msg: "price cannot be empty",
        },
        isDecimal: {
          msg: "price must be in decimal",
        },
      },
    },
    shortDescription: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "shortDescription cannot be null",
        },
        notEmpty: {
          msg: "shortDescription cannot be empty",
        },
      },
    },
    // description: {
    //   type: Sequelize.TEXT,
    //   allowNull: true,
    //   // validate: {
    //   //   notNull: {
    //   //     msg: "description cannot  null",
    //   //   },
    //   //   notEmpty: {
    //   //     msg: "description cannot be empty",
    //   //   },
    //   // },
    // },
    // productUrl: {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //   validate: {
    //     notNull: {
    //       msg: "description cannot be null",
    //     },
    //     notEmpty: {
    //       msg: "description cannot be empty",
    //     },
    //     isUrl: {
    //       msg: "Invalid productUrl string",
    //     },
    //   },
    // },
    category: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      validate: {
        notEmpty: {
          msg: "category cannot be empty",
        },
      },
    },
    // tags: {
    //   type: Sequelize.ARRAY(Sequelize.STRING),
    //   validate: {
    //     notEmpty: {
    //       msg: "category cannot be empty",
    //     },
    //   },
    // },
    createdBy: {
      type: Sequelize.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE", 
      onUpdate: "CASCADE",
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "project",
  }
);
