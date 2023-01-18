// VERIFICATION DE L'INPUT DES SAUCES
module.exports = (req, res, next) => {
    if (JSON.parse(req.body.sauce !== undefined)) {
      const sauce = JSON.parse(req.body.sauce);
      let { name, manufacturer, description, mainPepper } = sauce;
      let trimedTab = [];
  
      function toTrim(...string) {
        trimedTab = string.map((elt) => elt.trim());
      }
      toTrim(name, manufacturer, description, mainPepper);
  
      const minInput = (currentValue) => currentValue.length >= 3;
      if (trimedTab.every(minInput)) {
        next();
      } else {
        throw new Error('Tous les champs doivent contenir au moins 3 caractères');
      }
    } else {

      const sauce = req.body;
      let { name, manufacturer, description, mainPepper } = sauce;
      let trimedTab = [];
  
      function toTrim(...string) {
        trimedTab = string.map((elt) => elt.trim());
      }
      toTrim(name, manufacturer, description, mainPepper);
  
      const minInput = (currentValue) => currentValue.length >= 3;
      if (trimedTab.every(minInput)) {
        next();
      } else {
        throw new Error('Tous les champs doivent contenir au moins 3 caractères');
      }
    }
  };