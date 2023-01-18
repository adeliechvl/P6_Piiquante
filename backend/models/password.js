const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
  .is().min(8) // Longueur minimun : 8
  .is().max(64) // Longueur maximum : 64
  .has().uppercase() // Doit contenir au moins une majuscule
  .has().lowercase() // Doit contenir au moins une minuscule
  .has().digits() // Doit contenir au moins un chiffre
  .has().not().spaces(); // Ne doit pas contenir d'espaces

module.exports = passwordSchema;