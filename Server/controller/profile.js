const AptitudeProfile = require('../models/profile')
const AptitudeUser = require('../models/user')
const path = require('path');
const fs = require('fs');

const addProfile = async (req, res) => {
  try {
    const { name, role, email } = req.body;
  const image = req.file;
    const user = await AptitudeUser.findOne({ email });
    const profile = await AptitudeProfile.create({
      user: req.user.userId,
      name,
      role,
      email,
      image: image ? image.filename : 'noprofile.png',
      
    });
    res.status(201).json({ profile });
  } catch (err) {
    console.error('Add Profile Error:', err); // 👈 log the exact issue
    res.status(500).json({ message: err.message });
  }
};


const getProfile = async (req, res) =>{
    try{
        const profile = await AptitudeProfile.findOne({user:req.params.userId})
        res.status(200).json({profile});
        }catch(err){
            res.status(500).json({message:err.message})
        }
}

const getProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const profile = await AptitudeProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateProfile = async (req, res) =>{
    try{
        const {name,email,role} = req.body
        const image = req.file;

        const profile = await AptitudeProfile.findById({user:req.params.userId})
        if(!profile){
            return res.status(400).json({message:"Profile not exists"})
        }

        if(name) profile.name = name;
        if(email) profile.email = email;
        if(role) profile.role = role;
        if(image) profile.image = `/profiles/${image.filename}`;

        const updatedProfile = await profile.save()
        res.status(200).json({profile:updatedProfile});
        }catch(err){
            res.status(500).json({message:err.message})
            }
}

module.exports = {addProfile,getProfile,updateProfile,getProfileByUserId}