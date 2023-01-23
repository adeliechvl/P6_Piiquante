const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const checkSauceInput = require('../middleware/check-sauce-input');

router.get('/', auth, sauceCtrl.getAllSauces); // Route qui permet de récupérer toutes les sauces
router.get('/:id', auth, sauceCtrl.getOneSauce); // Route qui permet de récupérer une sauce
router.post('/', auth, multer, checkSauceInput, sauceCtrl.createSauce); // Route qui permet de créer une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Route qui permet de modifier une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Route qui permet de supprimer une sauce
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce); // Route qui permet de gérer les Likes et Dislikes des sauces

module.exports = router;