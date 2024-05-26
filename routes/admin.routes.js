const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authJwt = require('../middleware/authJwt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload-unique-codes', [authJwt.verifyToken, authJwt.isAdmin], upload.single('file'), adminController.uploadUniqueCodes);
router.post('/generate-qr-codes', [authJwt.verifyToken, authJwt.isAdmin], adminController.generateQRCodes);
router.post('/create-unique-code', [authJwt.verifyToken, authJwt.isAdmin], adminController.createUniqueCode);
router.put('/update-unique-code/:id', [authJwt.verifyToken, authJwt.isAdmin], adminController.updateUniqueCode);
router.delete('/delete-unique-code/:id', [authJwt.verifyToken, authJwt.isAdmin], adminController.deleteUniqueCode);
router.get('/dashboard', [authJwt.verifyToken, authJwt.isAdmin], adminController.dashboard);
router.put('/edit-user/:id', [authJwt.verifyToken, authJwt.isAdmin], adminController.editUser);
router.delete('/delete-user/:id', [authJwt.verifyToken, authJwt.isAdmin], adminController.deleteUser);

module.exports = router;
