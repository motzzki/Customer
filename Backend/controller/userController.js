import bcrypt from "bcryptjs";
import pool from "../db.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const [existingUser] = await pool.execute(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.execute("INSERT INTO user (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  try {
    // 1. Check admin user
    const [adminUsers] = await pool.execute(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (adminUsers.length > 0) {
      const user = adminUsers[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid username or password" });
      }

      const token = jwt.sign(
        {
          userId: user.user_id,
          firstname: user.firstname,
          role: "admin", // distinguish type
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res
        .status(200)
        .json({ success: true, message: "Login successful", token });
    }

    // 2. Check sub_user
    const [subUsers] = await pool.execute(
      "SELECT * FROM sub_user WHERE sub_username = ?",
      [username]
    );

    if (subUsers.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });
    }

    const subUser = subUsers[0];
    const validPassword = await bcrypt.compare(password, subUser.sub_password);

    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        userId: subUser.sub_userId,
        firstname: subUser.sub_firstname,
        role: "sub_user",
        // distinguish type
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//register a sub_user

export const registerSubUser = async (req, res) => {
  const { username, password, firstname, lastname } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const [existingUser] = await pool.execute(
      "SELECT * FROM sub_user WHERE sub_username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.execute(
      "INSERT INTO sub_user (sub_username, sub_password, sub_firstname, sub_lastname) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, firstname, lastname]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// change password

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;
  const role = req.user.role; // get userType from token

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Old and new passwords are required" });
  }

  try {
    let user, validOldPassword;

    if (role === "admin") {
      const [users] = await pool.execute(
        "SELECT * FROM user WHERE user_id = ?",
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      user = users[0];
      validOldPassword = await bcrypt.compare(oldPassword, user.password);

      if (!validOldPassword) {
        return res.status(400).json({ message: "Invalid old password" });
      }

      const hashedNewPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.SALT_ROUNDS)
      );
      await pool.execute("UPDATE user SET password = ? WHERE user_id = ?", [
        hashedNewPassword,
        userId,
      ]);
    } else if (role === "sub_user") {
      const [users] = await pool.execute(
        "SELECT * FROM sub_user WHERE sub_userId = ?",
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      user = users[0];
      validOldPassword = await bcrypt.compare(oldPassword, user.sub_password);

      if (!validOldPassword) {
        return res.status(400).json({ message: "Invalid old password" });
      }

      const hashedNewPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.SALT_ROUNDS)
      );
      await pool.execute(
        "UPDATE sub_user SET sub_password = ? WHERE sub_userId = ?",
        [hashedNewPassword, userId]
      );
    }

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
