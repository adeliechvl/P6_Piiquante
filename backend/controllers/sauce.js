const Sauce = require('../models/sauce');

const fs = require('fs');

// CREER UNE SAUCE
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
    .catch(error => { res.status(400).json({ error }) })
};

// MODIFIER UNE SAUCE
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (req.auth.userId != sauce.userId) {
          res.status(403).json({ error: "403: unauthorized request" });
          return;
        }
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

// SUPPRIMER UNE SAUCE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.auth.userId !== sauce.userId ) {
        res.status(403).json({ message: "403: unauthorized request" });
        return;
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
  };
  
// RECUPERER UNE SAUCE
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// RECUPERER TOUTES LES SAUCES
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// LIKE ET DISLIKE DES SAUCES
exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;
 
 //LIKER SAUCE
  if (like === 1) {
    //maj de la sauce, ajouter l'user à l'array usersLiked avec $push, incrémenter les likes de 1 avec methode $inc, inclue dans mongodb
    Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: 1 } })
      .then(() => res.status(200).json("Sauce likée !"))
      .catch(error => res.status(400).json({ error }));
  }

  //DISLIKE SAUCE
  if (like === -1) {
    //maj de la sauce, ajouter l'user à l'array usersDisliked, incrément les dislikes de 1
    Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
      .then(() => res.status(200).json("sauce disliké"))
      .catch(error => res.status(400).json({ error }));
  }

  //ANNULER LIKE OU DISLIKE
  if (like === 0) {
    //trouver la sauce
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        //si l'utilisateur était dans l'array userLiked, il annule son like
        if (sauce.usersLiked.includes(userId)) {
          //maj de la sauce, on enleve l'user de l'array $pull, et on décrémente les likes
          Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
            .then(() => res.status(200).json("like retiré"))
            .catch(error => res.status(400).json({ error }));
        }
        //si l'user était dans l'array des usersDisliked, il annule son dislike
        else if (sauce.usersDisliked.includes(userId)) {
          //maj de la sauce, on enleve l'user de l'array des dislike, décrément des dislike
          Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
            .then(() => res.status(200).json("Dislike retiré"))
            .catch(error => res.status(400).json({ error }));
        }
      })
      //Sauce introuvable 404
      .catch(error => res.status(404).json({ error }));
  }
};