const express   = require('express'),
      mongoose  = require('mongoose'),
      passport  = require('passport');

const router = express.Router();

// Load Validation

const validateProfileInput = require('../../validation/profile');

// Load Profile Model
const Profile = require('../../models/Profile');

// Load User Model
const User = require('../../models/User');

// @route   GET api/profile/
// @desc    Get current user profile 
// @access  Private

router.get('/', passport.authenticate('jwt', { session: false }),
(req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id})
  .then(profile => {
    if(!profile){
      errors.noProfile = "There is no profile for this user";
      return res.status(404).json(errors);
    }
    res.json(profile);
  })
  .catch(err => res.status(404).json(err));
});

// @route   POST api/profile/
// @desc    Create or edit user profile 
// @access  Private

router.post('/', passport.authenticate('jwt', { session: false }),
(req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  
  // Check Validation
  if(!isValid){
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  // Get fields
  const profilFields ={};
  profilFields.user = req.user.id;
  if(req.body.handle) profilFields.handle = req.body.handle;
  if(req.body.company) profilFields.company = req.body.company;
  if(req.body.website) profilFields.website = req.body.website;
  if(req.body.location) profilFields.location = req.body.location;
  if(req.body.bio) profilFields.bio = req.body.bio;
  if(req.body.status) profilFields.status = req.body.status;
  if(req.body.githubusername) profilFields.githubusername = req.body.githubusername;
  // Skills - spilt to array
  if( typeof req.body.skills !== "undefined"){
    profilFields.skills = req.body.skills.split(',');
  }
  // Social
  profilFields.social = {};
  if(req.body.youtube) profilFields.social.youtube = req.body.youtube;
  if(req.body.twitter) profilFields.social.twitter = req.body.twitter;
  if(req.body.facebook) profilFields.social.facebook = req.body.facebook;
  if(req.body.linkedin) profilFields.social.linkedin = req.body.linkedin;
  if(req.body.instagram) profilFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id})
  .then(profile => {
    if(profile) {
      // Update profile
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profilFields },
        { new: true }
        )
        .then(profile => res.json(profile));
    }else {
      // Create profile

      // Check if handle exitst
      Profile.findOne({ handle: profilFields.handle})
      .then(profile => {
        if(profile){
          errors.handle = " That handle already exists";
          res.status(400).json(errors);
        }

        //Save Profile
        new Profile(profilFields).save()
        .then(profile =>{
          res.json(profile);
        })
      })
    }
  })
});


module.exports = router;
