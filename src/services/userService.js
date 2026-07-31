import User from "../model/userModel.js";
import { Op } from "sequelize";
export class UserService {
  async createUser({ firstname, lastname, email, phone, role }, password) {
    const [user, created] = await User.findOrCreate({
      where: {
        firstname,
        email,
      },
      defaults: {
        firstname,
        lastname,
        email,
        password,
        phone,
        role,
      },
    });

    if (!created) {
      throw new Error("User already Exists");
    }

    return user;
  }

  async getUserByResetPassword(resetPasswordToken) {
    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });
    if (!user) {
      throw new Error("Invalid or Expired Token");
    }
    return user;
  }

  async loginUser({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Incorrect Email or Password");
    }
    if (user.role === "user") {
      throw new Error("User not registered as Volunteer or NGO Admin");
    }
    user.lastLogin = new Date();
    await user.save();
    return user;
  }

  async getUserById(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async confirmEmail({ email }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("No user found with that email");
    }
    return user;
  }

  async getAllUsers() {
    const users = await User.findAll();
    if (!users) {
      throw new Error("No user found");
    }

    return users;
  }

  async getUserById(id) {
    const user = User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async editUser(id, updates) {
    const changedColumns = await User.update(updates, {
      where: { id },
      validate: true,
    });

    if (changedColumns === 0) {
      throw new Error("User not found or no changes made");
    }
    const user = await this.getUserById(id);
    return user;
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    await user.destroy();
    return true;
  }
}
