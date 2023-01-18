const sauce = require('../models/sauce');
const fs = require('fs');

// CREER UNE SAUCE
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
    .catch(error => { res.status(400).json( { error })})
 };

 // MODIFIER UNE SAUCE
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

 // SUPPRIMER UNE SAUCE
exports.deleteSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

 // RECUPERER UNE SAUCE
 exports.getOneSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
      .then((sauce) => res.status(200).json(sauce))
      .catch((error) => res.status(404).json({ error }));
  };
  
// RECUPERER TOUTES LES SAUCES
exports.getAllSauces = (req, res, next) => {
    sauce.find()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({ error }));
  };
  
// LIKE ET DISLIKE DES SAUCES
exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like; 
    let userId = req.body.userId;
    let sauceId = req.params.id;
    sauce.findOne({ _id: sauceId }).then((sauce) => {
      switch (like) {
        case 1:
          if (sauce.usersLiked.includes(req.userId)) {
            res.status(400).json({ message: 'Impossible de faire cette action' });
            return;
          }
          // LIKE
          sauce.updateOne(
            { _id: sauceId },
            { $push: { usersLiked: userId }, $inc: { likes: +1 } }
          )
            .then(() => res.status(200).json({ message: `J'aime` }))
            .catch((error) => res.status(400).json({ error }));
          break;
  
        case 0:
          // DISLIKE
          if (sauce.usersLiked.includes(req.userId)) {
            sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: `Neutre` }))
              .catch((error) => res.status(400).json({ error }));
          }
          // ANNULE DISLIKE
          if (sauce.usersDisliked.includes(req.userId)) {
            sauce.updateOne(
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
          sauce.updateOne(
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