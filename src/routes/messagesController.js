/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load models
 */
const Messages = require('../models/Messages');

// Load Sequelize model
const db = require('../methods/dbConnect');

const Msg = db.msg;
         

/**
 * Using router middleware
 */
const router = express.Router();

/**
 * Get all messages
 */
router.get('/', (req, res) => {
    
    Msg.findAll()
      .then((results) => {
        let arr = [...results];
        let temp =[];
        arr.forEach((obj)=>{
          temp.push(obj.dataValues);
        });
        
        //let temp = JSON.parse(results);
  
        temp.forEach((obj, index) => {
          let message = new Messages(obj.title, obj.text, obj.cr_date);
          // Decode query return
          temp[index] = message.decodeOutput();
        });
  
        temp = JSON.stringify(temp);
  
        res.status(200);
        res.end(temp);
      })
      .catch((err) => {
        console.log(err);
      });

});

/**
 * Get one message by title
 */
router.get('/:title', (req, res) => {
  Msg
    .findOne({where:{ title: req.params.title }})
    .then((result) => {
      // Decode query return
      let temp = result.dataValues;
      let message = new Messages(temp.title, temp.text, temp.cr_date);
      temp = message.decodeOutput();
      temp = JSON.stringify(temp);

      res.status(200);
      res.end(temp);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Insert new message
 */
router.post('/', (req, res) => {
  const message = new Messages(req.body.title, req.body.text, req.body.cr_date);

  // Checking input
  if (message.checkInsert()) {
    // Encoding input before sending query
    Msg.create(message.encodeInsert());
    res.status(201).send();
  } else {
    res.status(406).send();
  }
});

/**
 * Delete a message
 */
router.delete('/:title', (req, res) => {
  Msg.destroy({where: {title: req.params.title} })
  .then(()=>{
    res.status(202).send();
  })
  .catch((err)=>{
    throw err;
  })
});

/**
 * Edit a message
 */
router.post('/:title', (req, res) => {
  const message = new Messages(req.body.title, req.body.text);

  if (message.checkInsert()) {
    Msg.update(
      // values to update
      message.encodeInsert(),
      {
        where : {title : req.params.title}
      }
      ).then(()=>{
        res.status(202).send();
      }).catch((err)=>{
        res.status(404).send();
      })
    
  } else {
    res.status(406).send();
  }
});

module.exports = router;
