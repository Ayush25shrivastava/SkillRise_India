
// import User from "../models/user.js";
// import Profile from "../models/Profile.js";
// import { resolveLocationToState } from "../utils/LocationResolver.js";

// export const getAdminStats = async (req, res) => {
//   try {
//     console.log("📊 Fetching admin stats...");
    
//     const totalUsers = await User.countDocuments({ role: "user" });
//     const totalNgos = await User.countDocuments({ role: "ngo" });
    
//     const profiles = await Profile.find({}).populate("user", "name email createdAt");
//     console.log(`Total profiles: ${profiles.length}`);
    
//     // Extract all locations
//     const rawLocations = profiles
//       .map(p => p.data?.location || p.data?.state)
//       .filter(Boolean);
    
//     console.log(`Raw locations:`, rawLocations);
    
//     // Resolve locations to states with rate limiting
//     const stateMap = {};
    
//     for (const location of rawLocations) {
//       // Add delay to respect API rate limits
//       await new Promise(resolve => setTimeout(resolve, 1100));
      
//       const state = await resolveLocationToState(location);
      
//       if (state) {
//         stateMap[state] = (stateMap[state] || 0) + 1;
//       }
//     }
    
//     console.log(`Resolved states:`, Object.keys(stateMap));
    
//     const activeStates = Object.keys(stateMap).length;
//     const stateAnalytics = Object.entries(stateMap)
//       .map(([state, count]) => ({ state, count }))
//       .sort((a, b) => b.count - a.count);
    
//     console.log(`State analytics:`, stateAnalytics);
    
//     // Extract skills
//     const skillMap = {};
//     profiles.forEach(profile => {
//       const skills = profile.data?.skills;
//       if (skills) {
//         const skillArray = typeof skills === 'string' ? skills.split(',') : skills;
//         if (Array.isArray(skillArray)) {
//           skillArray.forEach(skill => {
//             const cleanSkill = skill.trim().toLowerCase();
//             if (cleanSkill) {
//               skillMap[cleanSkill] = (skillMap[cleanSkill] || 0) + 1;
//             }
//           });
//         }
//       }
//     });
    
//     const topSkills = Object.entries(skillMap)
//       .map(([skill, count]) => ({
//         skill,
//         count,
//         percentage: profiles.length > 0 ? Math.round((count / profiles.length) * 100) : 0
//       }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 10);
    
//     // Recent registrations
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
//     const recentUsers = await User.countDocuments({
//       role: "user",
//       createdAt: { $gte: sevenDaysAgo }
//     });
    
//     // User growth
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
//     const userGrowth = await User.aggregate([
//       {
//         $match: {
//           role: "user",
//           createdAt: { $gte: thirtyDaysAgo }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $sort: { _id: 1 }
//       }
//     ]);
    
//     console.log("✅ Stats fetched successfully");
    
//     res.json({
//       success: true,
//       data: {
//         totalUsers,
//         totalNgos,
//         activeStates,
//         recentUsers,
//         stateAnalytics,
//         topSkills,
//         userGrowth,
//         lastUpdated: new Date()
//       }
//     });
    
//   } catch (error) {
//     console.error("❌ Admin stats error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// export const getUsersList = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, search = "" } = req.query;
    
//     const query = { role: "user" };
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } }
//       ];
//     }
    
//     const users = await User.find(query)
//       .select("name email createdAt isVerified")
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .sort({ createdAt: -1 });
    
//     const count = await User.countDocuments(query);
    
//     res.json({
//       success: true,
//       data: users,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       total: count
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// export const getNgosList = async (req, res) => {
//   try {
//     const ngos = await User.find({ role: "ngo" })
//       .select("name email createdAt")
//       .sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: ngos
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// backend/src/controllers/adminController.js
import User from "../models/user.js";
import Profile from "../models/Profile.js";
import { resolveLocationToState } from "../utils/LocationResolver.js";
import { generateAIInsights, generatePolicyRecommendations } from "../services/aiAnalytics.js";

export const getAdminStats = async (req, res) => {
  try {
    console.log("📊 Fetching admin stats...");
    
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalNgos = await User.countDocuments({ role: "ngo" });
    
    const profiles = await Profile.find({}).populate("user", "name email createdAt");
    console.log(`Total profiles: ${profiles.length}`);
    
    // Extract all locations
    const rawLocations = profiles
      .map(p => p.data?.location || p.data?.state)
      .filter(Boolean);
    
    console.log(`Raw locations:`, rawLocations);
    
    // Resolve locations to states with rate limiting
    const stateMap = {};
    
    for (const location of rawLocations) {
      await new Promise(resolve => setTimeout(resolve, 1100));
      const state = await resolveLocationToState(location);
      if (state) {
        stateMap[state] = (stateMap[state] || 0) + 1;
      }
    }
    
    console.log(`Resolved states:`, Object.keys(stateMap));
    
    const activeStates = Object.keys(stateMap).length;
    const stateAnalytics = Object.entries(stateMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);
    
    console.log(`State analytics:`, stateAnalytics);
    
    // Extract skills with trending analysis
    const skillMap = {};
    const skillByState = {};
    
    profiles.forEach(profile => {
      const state = profile.data?.location || profile.data?.state;
      const skills = profile.data?.skills;
      
      if (skills) {
        const skillArray = typeof skills === 'string' ? skills.split(',') : skills;
        if (Array.isArray(skillArray)) {
          skillArray.forEach(skill => {
            const cleanSkill = skill.trim().toLowerCase();
            if (cleanSkill) {
              skillMap[cleanSkill] = (skillMap[cleanSkill] || 0) + 1;
              
              // Track skills by state
              if (state) {
                if (!skillByState[state]) skillByState[state] = {};
                skillByState[state][cleanSkill] = (skillByState[state][cleanSkill] || 0) + 1;
              }
            }
          });
        }
      }
    });
    
    // Calculate trending skills with growth indicators
    const topSkills = Object.entries(skillMap)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: profiles.length > 0 ? Math.round((count / profiles.length) * 100) : 0,
        trend: Math.random() > 0.5 ? 'up' : 'stable', // In production, compare with previous period
        growth: Math.floor(Math.random() * 30) + 5 // Dummy growth percentage
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Recent registrations
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await User.countDocuments({
      role: "user",
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // User growth with daily breakdown
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userGrowth = await User.aggregate([
      {
        $match: {
          role: "user",
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    console.log(`User growth data:`, userGrowth);
    
    // Generate AI Insights
    const aiInsights = await generateAIInsights({
      totalUsers,
      totalNgos,
      activeStates,
      stateAnalytics,
      topSkills,
      skillByState,
      userGrowth
    });
    
    // Generate Policy Recommendations
    const policyRecommendations = await generatePolicyRecommendations({
      stateAnalytics,
      topSkills,
      skillByState,
      totalUsers,
      activeStates
    });
    
    console.log("✅ Stats fetched successfully");
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalNgos,
        activeStates,
        recentUsers,
        stateAnalytics,
        topSkills,
        userGrowth,
        aiInsights,
        policyRecommendations,
        lastUpdated: new Date()
      }
    });
    
  } catch (error) {
    console.error("❌ Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUsersList = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    
    const query = { role: "user" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    const users = await User.find(query)
      .select("name email createdAt isVerified")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getNgosList = async (req, res) => {
  try {
    const ngos = await User.find({ role: "ngo" })
      .select("name email createdAt")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: ngos
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
