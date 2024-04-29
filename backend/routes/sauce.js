const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');


router.get('/',auth, sauceCtrl.findAllSauce);
router.post('/',auth, sauceCtrl.createSauce);
router.get('/:id',auth, sauceCtrl.findOneSauce);
router.put('/:id',auth, sauceCtrl.updateSauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);



module.exports = router;