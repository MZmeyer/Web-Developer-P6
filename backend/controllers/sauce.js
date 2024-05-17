const sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;

    const Sauce = new sauce({
      ...sauceObject,
      userId:req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes:0,
      dislikes:0,
      usersLiked:[],
      usersDisliked:[]
    });

    Sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.updateSauce = (req, res, next) => {
    const { heat } = req.body;    
    const updatedSauce = {
        heat: heat
    };
    
    if (req.file) {
        updatedSauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
        
    delete updatedSauce._userId;
    
    sauce.findOneAndUpdate(
        { _id: req.params.id, userId: req.auth.userId }, 
        updatedSauce, 
        { new: true } 
    )
    .then(updatedSauce => {
        if (!updatedSauce) {            
            return res.status(401).json({ message : 'Sauce not found or unauthorized' });
        }        
        res.status(200).json({ message : 'Sauce modifiée!', sauce: updatedSauce });
    })
    .catch(error => {        
        res.status(400).json({ error });
    });
};


exports.deleteSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id})
  .then(sauce => {
      if (sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'Non autorisé!'});
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

exports.findAllSauce = (req, res, next) => {
  sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
  };    

exports.findOneSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

exports.updateLike = (req, res, next) => {
    const { like } = req.body;
    const userId = req.auth.userId;

    sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if (!sauce) {
            return res.status(404).json({ error: 'Sauce not found' });
        }
        if (like === 1) {
            if (!sauce.usersLiked.includes(userId)) {
                sauce.usersLiked.push(userId);
                sauce.likes = sauce.usersLiked.length;
                if (sauce.usersDisliked.includes(userId)) {
                    sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
                    sauce.dislikes = sauce.usersDisliked.length;
                }
            }
        } else if (like === 0) {
            sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
            sauce.likes = sauce.usersLiked.length;
            sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
            sauce.dislikes = sauce.usersDisliked.length;
        } else if (like === -1) {
            if (!sauce.usersDisliked.includes(userId)) {
                sauce.usersDisliked.push(userId);
                sauce.dislikes = sauce.usersDisliked.length;
                if (sauce.usersLiked.includes(userId)) {
                    sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
                    sauce.likes = sauce.usersLiked.length;
                }
            }
        } else {
            return res.status(400).json({ error: 'Invalid like value' });
        }
        sauce.save()
        .then(updatedSauce => res.status(200).json({ message: 'Likes modifiés!', sauce: updatedSauce }))
        .catch(error => {
            console.error("Erreur update sauce:", error);
            res.status(400).json({ error: 'Echec de mise à jour' });
        });
    })
    .catch(error => {
        console.error("Erreur serveur:", error);
        res.status(500).json({ error: 'Erreur serveur' });
    });
};
