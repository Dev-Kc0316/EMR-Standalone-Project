import User from "../model/userModel.js";
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
}
