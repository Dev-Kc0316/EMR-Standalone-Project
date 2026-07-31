import sequelize from "../config/database.js";

import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("receptionist", "nurse", "doctor", "admin"),
      defaultValue: "receptionist",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isPasswordChanged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          let salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          let salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    tableName: "users",
    paranoid: true,
    timestamps: true,
    underscored: true,
  },
);

// Instance methods using the class method ideaology
User.prototype.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// ensure that when data is pulled from Database, some important sensitive data is not sent back
User.prototype.toJSON = function () {
  const values = { ...this.get({ plain: true }) }; // to ensure all nested models are converted to plain objects too
  delete values.password;
  delete values.resetPasswordToken;
  delete values.resetPasswordExpires;
  return values;
};
export default User;
