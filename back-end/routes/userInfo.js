import express from "express";
import fileUpload from 'express-fileupload';
import path from 'path';
import { User } from "../databaseConnection.js";


const __dirname = import.meta.dirname;

const userInfoRoute = express.Router();

// Middleware to handle file uploads
userInfoRoute.use(fileUpload());

// Upload profile picture
userInfoRoute.post("/api/change-profile-picture", async (req,res) => {
    try {
        const profilePic = req.files.profilePic;
        const newFileName = `${path.parse(profilePic.name).name}_${Date.now()}${path.extname(profilePic.name)}`;
        const uploadPath = path.join(__dirname,'..','..','front-end','public','Uploads',  `${newFileName}`);

        // move image to uploads directory
        await profilePic.mv(uploadPath);

        // update into db
        await updateProfilePicture(newFileName);

        res.status(200).send({ message: 'Success', uploadPath: `${newFileName}` });
    } catch (error) {
        console.error(error.message);
        res.status(400).send({message:"failure"});
    }
    
});

async function updateProfilePicture(newFileName) {
    try {

        
        const res = await User.updateOne({username:"johndoe"},{profilePic:`${newFileName}`})
        
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}


// Update personal info only
userInfoRoute.post("/api/update-personal-info", async (req, res) => {
  try {
    const personalInfo = req.body.personalInfo;

    if (!personalInfo) {
      return res.status(400).json({ message: "Missing personal info data" });
    }

    const updateData = {};
    if (personalInfo["first-name"]) updateData["first-name"] = personalInfo["first-name"];
    if (personalInfo["last-name"]) updateData["last-name"] = personalInfo["last-name"];
    if (personalInfo.email) updateData.email = personalInfo.email;
    if (personalInfo["phone-number"]) updateData["phone-number"] = personalInfo["phone-number"];

    const result = await User.updateOne(
      { username: "johndoe" },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "User not found or data unchanged" });
    }

    res.status(200).json({ message: "Personal info updated successfully" });
  } catch (error) {
    console.error("Error updating personal info:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update address info only
userInfoRoute.post("/api/update-address-info", async (req, res) => {
  try {
    const addressInfo = req.body.addressInfo;

    if (!addressInfo) {
      return res.status(400).json({ message: "Missing address info data" });
    }

    const updateData = {};
    if (addressInfo.country) updateData.country = addressInfo.country;
    if (addressInfo.city) updateData.city = addressInfo.city;

    const result = await User.updateOne(
      { username: "johndoe" },  // change as per your auth system
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "User not found or data unchanged" });
    }

    res.status(200).json({ message: "Address info updated successfully" });
  } catch (error) {
    console.error("Error updating address info:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Get profile picture
userInfoRoute.get("/api/profile-picture", async (req, res) => {
  try {
    const user = await User.findOne({ username: "johndoe"  }, { profilePic: 1, _id: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ profilePic: user.profilePic });
  } catch (error) {
    console.error("Error fetching profile picture:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get personal info
userInfoRoute.get("/api/personal-info", async (req, res) => {
  try {
    const user = await User.findOne(
      { username: "johndoe" },
      {
        "first-name": 1,
        "last-name": 1,
        email: 1,
        "phone-number": 1,
        _id: 0
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ personalInfo: user });
  } catch (error) {
    console.error("Error fetching personal info:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get address info
userInfoRoute.get("/api/address-info", async (req, res) => {
  try {
    const user = await User.findOne(
      { username: "johndoe" },
      {
        country: 1,
        city: 1,
        _id: 0
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ addressInfo: user });
  } catch (error) {
    console.error("Error fetching address info:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { userInfoRoute };