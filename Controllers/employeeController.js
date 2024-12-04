import Employee from "../Models/employeeSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const registerEmployee = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);
    const newEmployee = new Employee({
      username,
      email,
      password: hashPassword,
      role,
    });
    await newEmployee.save();

    const resetUrl = `https://remarkable-klepon-d9704b.netlify.app/login`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: newEmployee.email,
      subject: "Welcome to Our Platform",
      html: `<p>Hi ${username},</p>
             <p>Welcome to our platform! You can log in using the link below:</p>
             <p><a href="${resetUrl}">Click here to log in</a></p>
             <p>Thank you for joining us!</p>`,
    };

    // Wrap email sending in a try-catch block
    try {
      await transporter.sendMail(mailOptions);
      console.log("Welcome email sent successfully.");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }

    res.status(200).json({ message: "Register Successful", data: newEmployee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Register Failed, Internal Server error" });
  }
};

export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: "Employee not found" });
    }
    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ _id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    employee.token = token;
    await employee.save();
    res.status(200).json({
      message: "Login Successful",
      data: employee,
      token: token,
      employeeName: employee.username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login Failed" });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const employee = await Employee.findById(employeeId);
    res.status(200).json({ message: "Welcome", data: employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Employee not found" });
  }
};
