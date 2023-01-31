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
      if (sauce.userId != req.auth.userId) {
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
    .catch((error) => res.status(500).json({ error }));
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
  Sauce.findOne({ _id: sauceId }).then((sauce) => {
    switch (like) {
      case 1:
        if (sauce.usersLiked.includes(req.userId)) {
          res.status(400).json({ message: '403: unauthorized request' });
          return;
        }
        // LIKE
        Sauce.updateOne(
          { _id: sauceId },
          { $push: { usersLiked: userId }, $inc: { likes: +1 } }
        )
          .then(() => res.status(200).json({ message: `J'aime` }))
          .catch((error) => res.status(400).json({ error }));
        break;

      case 0:
        // DISLIKE
        if (sauce.usersLiked.includes(req.userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(() => res.status(200).json({ message: `Neutre` }))
            .catch((error) => res.status(400).json({ error }));
        }
        // ANNULE DISLIKE
        if (sauce.usersDisliked.includes(req.userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          )
            .then(() => res.status(200).json({ message: `Neutre` }))
            .catch((error) => res.status(400).json({ error }));
        }
        break;

      case -1:
        if (sauce.usersDisliked.includes(req.userId)) {
          res.status(400).json({ message: 'Impossible de faire cette action' });
          return;
        }
        Sauce.updateOne(
          { _id: sauceId },
          { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
        )
          .then(() => {
            res.status(200).json({ message: `Je n'aime pas` });
          })
          .catch((error) => res.status(400).json({ error }));
        break;

      default:
        console.log(error);
    }
  });
};