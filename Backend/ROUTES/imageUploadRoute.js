const router = require("express").Router();
const uploadImage = require("../MIDDLEWARE/uploadImage");
const uploadImageController = require("../CONTROLLER/ImageUploadController");
const authenticationTokenChecking = require("../MIDDLEWARE/authenticationTokenChecking");

router.post(
  "/upload_avatar",
  uploadImage,
  authenticationTokenChecking,
  uploadImageController.uploadAvatar
);

module.exports = router;
