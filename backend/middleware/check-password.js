// VERIFICATION DU MDP
const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({
      message:
        'Le mot de passe doit contenir au moins 10 caractères dont une majuscule, une minuscule et un chiffre.',
    });
  } else {
    next();
  }
};