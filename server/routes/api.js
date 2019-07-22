const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const reponse = require('../models/reponse');
const row = require('../models/row');
const rows2 = require('../models/row2');
const tweet = require('../models/tweet');
const PythonShell = require('python-shell');

const portefeuille  = require('../models/portefeuille');
const profilestatique  = require('../models/profilestatique');

const db = "mongodb://admin:roboadvisor07@ds237192.mlab.com:37192/robo_advisor";
// const db = "mongodb://admin:bigdata5@ds247171.mlab.com:47171/qstapp";
// mongodb://<dbuser>:<dbpassword>@ds247171.mlab.com:47171/qstapp

mongoose.Promise = global.Promise;
mongoose.connect(db, function(err) {
    if(err) {
        console.log('Error connecting');
    }
});
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
router.get('/all', function(req, res) {

    reponse.find({})
        .exec(function(err, reponses) {
            if (err) {
                console.log('Error getting the reponses');
            } else {
                console.log(reponses);
                res.json(reponses);
            }
        });
});
router.get('/actions', function(req, res) {

    // row.find({}, { designation: 1, slug: 1,_id:0 }).distinct('designation')
    row.aggregate([{"$group": { "_id": { designation: "$designation", slug: "$slug" } } }])
        .exec(function(err, reponses) {
            if (err) {
                console.log('Error getting the reponses');
            } else {
                console.log(reponses);
                res.json(reponses);
            }
        });
});
router.get('/comp', function(req, res) {
    const values = [];
    const max = {}
    // row.find({}, { designation: 1, slug: 1,_id:0 }).distinct('designation')
    row.aggregate([{"$group": { "_id": "$designation","value":{$sum: "$dernierCours"} }}]).sort({"totale": -1}).limit(10)
        .exec(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                result.forEach(function(item) {

                    values.push({"id":item._id,"value":item.value,"name":item._id})

                });
                max["id"] = ""
                max["subvalues"] = values;
                console.log(max)
                res.json(max);
            }
        });
});
router.get('/reponse/:id', function(req, res) {
    console.log('Requesting a specific reponse');
    reponse.findById(req.params.id)
        .exec(function(err, reponse) {
            if (err) {
                console.log('Error getting the Reponse');
            } else {
                res.json(reponse);
            }
        });
});

router.get('/delete_reponse/:id', function(req, res) {
  console.log('delete a specific reponse');
  reponse.findByIdAndDelete(req.params.id)
      .exec(function(err, reponse) {
          if (err) {
              console.log('Error deleting the Reponse');
          } else {
              res.json(reponse);
          }
      });
});

router.get('/tweets/:slug', function(req, res) {
    console.log('Requesting a specific reponse');
    tweet.find({'slug': req.params.slug})
        .exec(function(err, tweets) {
            if (err) {
                console.log('Error getting the tweets');
            } else {
                res.json(tweets);
            }
        });
});

router.get('/py/:nb', function(req, res) {

    var options = {
        mode:'json',
        args:[ req.params.nb ]
      }
      PythonShell.run('./server/test/test.py', options, function (err, data) {
        if (err) throw err;
        res.json(data);
        // res.send(data.toString())
      });
});

function base100(values) {

    values =  values.filter((value, index, array) => !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);

    base = [values[0][0],values[0][1],values[0][2],100,100]

    result = [base]
    values.forEach((item, index) => {
        if(index != 0){
            result.push([item[0],item[1],item[2],(item[1]/base[1])*100,(item[2]/base[2])*100]) ;
            // result.push([item[0],item[1],item[2],(item[1]/values[index-1][1])*100,(item[2]/values[index-1][2])*100]) ;
        }
    });

    return result
}

router.get('/masi/:slug', function(req, res) {
    console.log('Requesting for dashboard');
    row.aggregate([
        { $match:{'slug': req.params.slug}},
        { $lookup:{
            from: "masi",
            localField: "seance",
            foreignField: "seance",
            as: "masi_docs"
        }},
        { $sort:{'seance':1}},
     ])
   .exec(function(err, row) {
            if (err) {
                console.log(err);
                // console.log('Error getting the rows');
            } else {
                var from = null;
                var to = 0;
                var chartValues = [];

                row.forEach(function(item) {

                    var phptime= (new Date(item.seance)).getTime()/1000;
                    if(item.masi_docs[0]){chartValues.push([phptime,item.dernierCours,item.masi_docs[0].valeur]) ;}
                    if (from === null || from > phptime) {from = phptime;}
                    if (to < phptime) {to = phptime +1}
                });

                chartValues = base100(chartValues);

                var chartResult = {
                    'from' : from,
                    'to' : to,
                    'unit' : 'd',
                    'values' : chartValues
                    // 'values' : chartValues
                };

                console.log(chartResult);
                res.json(chartResult);
            }
        });
});

router.get('/card/:slug', function(req, res) {
    const values = [];
    row.find({'slug': req.params.slug}).sort({"seance": -1}).limit(1)
    .exec(function(err, row0) {
             values.push({"recent":row0})
             row.find({'slug': req.params.slug}).sort({"cap": -1}).limit(1)
             .exec(function(err, row1) {
                             values.push({"cap":row1})
                             row.find({'slug': req.params.slug}).sort({"dernierCours": -1}).limit(1)
                             .exec(function(err, row2) {
                                          values.push({"cour":row2},{"result":{'cap':(row0[0].cap*100)/row1[0].cap,'cour':(row0[0].dernierCours*100)/row2[0].dernierCours}})
                                          res.json(values);
                                      }
                                  );
                         }
                     );
             }
         );
 });

router.get('/rows2/:slug', function(req, res) {
    rows2.find({'slug': req.params.slug}).sort({"Date": -1}).limit(1)
    .exec(function(err, row2) {
        if (err) {
            console.log(err);
        } else {
            res.json(row2);
        }
    });
 });

router.get('/test/:slug', function(req, res) {
    row.aggregate([
        { $match:{'slug': req.params.slug}},
        { $lookup:{
            from: "masi",
            localField: "seance",
            foreignField: "seance",
            as: "masi_docs"
        }},
        { $sort:{'seance':1}},
     ])
   .exec(function(err, row0) {
        res.json(row0);
     });

});

router.get('/profil/:slug', function(req, res) {

  const values = [];
  const max = {};

  profilestatique.aggregate([{ $match: { 'ProfilStatique': req.params.slug } },{ $sample: { size: 1 } }])
  // profilestatique.find({}).distinct("ProfilStatique")
  // profilestatique.aggregate([
  //     { $match:{'ProfilStatique': req.params.slug}},
  //     { $lookup:{
  //         from: "portefeuilles",
  //         localField: "IdPersonne",
  //         foreignField: "IdPersonne",
  //         as: "portefeuille_docs"
  //     }},
  //     {
  //        $match: { "portefeuille_docs": { $ne: [] } }
  //     },
  //     { $sample: { size: 1 } }
  //     // { $sort:{'IdPersonne':1}},
  //  ])
    .exec(function(err, row0) {
        if (err) {
          res.json(err);
          console.log('Error getting the Reponse::'+err);
        } else {
          personne = row0[0].IdPersonne;

          portefeuille.aggregate([{ $match: { 'IdPersonne': personne } },
          { $project: { Actif: 1, total: { $multiply: [ "$CMPANet", "$QteExecutee" ] } } },
          {
            $group:{
                  _id: "$Actif",
                  value: { $avg: "$total" }
                }
          },{$sort:{value:-1}}
          ])
          .exec(function(err, result) {
              result.forEach(function(item) {

                  values.push({"id":item._id,"value":item.value,"name":item._id})

              });
              max["id"] = ""
              max["subvalues"] = values;
              res.json(max);
          });
        }
    });

});

router.post('/create', function(req, res) {
    console.log('Posting an Reponse');
    var newReponse = new reponse();
    newReponse.nom = req.body.nom;
    newReponse.prenom = req.body.prenom;
    newReponse.genre = req.body.genre;
    newReponse.age = req.body.age;
    newReponse.etat = req.body.etat;
    newReponse.emploi = req.body.emploi;
    newReponse.securite = req.body.securite;
    // newReponse.enfantcharge = req.body.enfantcharge;
    // newReponse.autrecharge = req.body.autrecharge;
    newReponse.object1 = req.body.object1;
    newReponse.object2 = req.body.object2;
    newReponse.object3 = req.body.object3;
    newReponse.object4 = req.body.object4;
    newReponse.object5 = req.body.object5;
    newReponse.object6 = req.body.object6;
    newReponse.object7 = req.body.object7;

    newReponse.invest1 = req.body.invest1;
    newReponse.invest2 = req.body.invest2;
    newReponse.invest3 = req.body.invest3;
    newReponse.invest4 = req.body.invest4;
    newReponse.invest5 = req.body.invest5;
    newReponse.invest6 = req.body.invest6;
    newReponse.invest7 = req.body.invest7;

    var age = req.body.age;
    if ( age > 70){age = 2    }
    else{
        if ( 60 < age && age < 71){age = 4    }
        else{
          if ( 50 < age && age < 61){age = 6   }
          else{
            if ( 40 < age && age < 51){age = 8    }
            else{age = 10   }
           }
        }
    }

    var score =   newReponse.object1+
                  newReponse.object2+
                  newReponse.object3+
                  newReponse.object4+
                  newReponse.object5+
                  newReponse.object6+
                  newReponse.object7+
                  newReponse.invest1+
                  newReponse.invest2+
                  newReponse.invest3+
                  newReponse.invest4+
                  newReponse.invest5+
                  newReponse.invest6+
                  newReponse.invest7+
                  age
    var prof
    if ( score < 48){prof = "Prudent"    }
    else{
        if ( 47 < score && score < 70){prof = "Equilibré"    }
        else{
          if ( 69 < score && score < 92){prof = "Dynamique"    }
          else{prof = "Risqué"    }
        }
    }

    newReponse.score = score
    newReponse.profil = prof


    // newReponse.renseignement22 = t;
    // newReponse.renseignement3 = req.body.renseignement3;
    // newReponse.minrendement = req.body.minrendement;
    // newReponse.maxpert = req.body.maxpert;

    newReponse.save(function(err, reponse) {
        if(err) {
            console.log('Error inserting the Reponse');
        } else {
            res.json(reponse);
        }
    });
});

router.post('/update', function(req, res) {
  console.log('updating an Reponse');
  // var newReponse = new reponse();
  reponse.updateOne({_id:req.body.id}, { $set: { montant: req.body.montant }}, function(err, reponse) {
    if(err) {
        console.log('Error updating the Reponse');
    } else {
        res.json(reponse);
    }
  });
  });



module.exports = router;
