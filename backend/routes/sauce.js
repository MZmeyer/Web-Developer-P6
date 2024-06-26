const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');


router.get('/', auth, sauceCtrl.findAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.findOneSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.post('/:id/like', auth,multer, sauceCtrl.updateLike);
router.delete('/:id', auth, sauceCtrl.deleteSauce);



module.exports = router;