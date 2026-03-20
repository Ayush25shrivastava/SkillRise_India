// import User from "../models/user.js";

// export const createProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const {
//       userType,
//       name,
//       location,
//       phone,
//       ...profileData
//     } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         userType,
//         name,
//         location,
//         phone,
//         profile: profileData,
//       },
//       { new: true }
//     );

//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import User from "../models/user.js";

export const createProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const userId = req.user.id;

    const { userType, ...profileData } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        userType,
        profile: profileData,
      },
      {
        returnDocument: "after", // ✅ FIXED warning
      }
    );

    res.json(updatedUser);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};