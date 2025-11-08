import { User } from '../models/models.js'
import bcrypt from 'bcryptjs'; // for password hashing

// /////////////////////////
// // Create a new user
// /////////////////////////
// const createUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists. Login instead.' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || 'student'
//     });

//     await user.save();

//     res.status(201).json({ message: 'User created successfully', user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

/////////////////////////
// Get all users
/////////////////////////
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/////////////////////////
// Get single user by ID
/////////////////////////
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


/////////////////////////
// Delete user by ID
/////////////////////////
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
//   createUser,
  getUsers,
  getUserById,
  deleteUser
};
