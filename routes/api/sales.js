const express = require('express');
const { query, validationResult } = require('express-validator');

const router = express.Router();
const Sale = require('../../models/Sale');


//(Step 2 route 1)
// This API code is creating a sale document by accepting all details in the request body
router.post('/', async (req, res) => {
    try {
      // Create a new sale document using the request body

      console.log(typeof req.body)

      console.log(req.body)
      
      const newSale = new Sale();
      newSale.saleDate = req.body.saleDate;
      newSale.items = req.body.items;
      newSale.storeLocation = req.body.storeLocation;
      newSale.customer = req.body.customer;
    
      console.log("Ola Amigos")
      console.log(newSale)
    
      // Save the new sale document to the collection
      await newSale.save();
    
      // Return the created sale object to the client
      res.status(201).json(newSale);
    } catch (err) {
      console.error(err);
      // Return a failure message to the client
      res.status(500).json({ message: 'Failed to create sale document' });
    }
    
  });


// (Step 2 route 2)This API code is for getting all the sales record 
//pertaing to the specific storelocation, number of
//records per page and specific page 
router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page) ;
      const perPage = parseInt(req.query.perPage);
      const storeLocation = req.query.storeLocation;
  
      if (isNaN(page) || isNaN(perPage)) {
        return res.status(400).send('Invalid query parameters');
      }
  
      console.log(storeLocation)
  
      const filter = storeLocation ? { storeLocation } : {};
  
      console.log("hiiii")
  
      const sales = await Sale.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);
  
      const count = await Sale.countDocuments(filter);
  
      res.status(200).json({
        sales: sales,
        currentPage: page,
        totalPages: Math.ceil(count / perPage)
      });
    } catch (err) {
      console.error(err);
      res.status(500).send( 'An error occurred while processing your request' );
    }
  });
  
  
//(Step 2 route 3) This API code is for retriveing a particular
//sales record associate dwith the _id
// This code is still preliminary
router.get('/:_id', (req,res)=>{

   Sale.findById(req.params._id)
   .then(sale=>res.send(sale))
   .catch(err => console.log(err))

});


//(Step 2 route 5) Thia API code is for updating the sole document based on  
// request body associated id

router.put('/:_id', async (req, res) => {

    console.log(req.params)

    const id = req.params._id

    //const { id } = req.params;

    try {
      // Find the sale document by its _id and update its contents with the request body
      const updatedSale = await Sale.findByIdAndUpdate(id, req.body, { new: true });
  
      // If no sale document was found with the given _id, return a failure message to the client
      if (!updatedSale) {
        return res.status(404).json({ message: `Sale document with _id ${id} not found` });
      }
  
      // Return the updated sale object to the client
      res.json(updatedSale);
    } catch (err) {
      console.error(err);
      // Return a failure message to the client
      res.status(500).json({ message: `Failed to update sale document with _id ${id}` });
    }
  });


//(Step 2 route 5) This API code is deleting a particular 
//record associate with _id passed as route parameter

// This code is still preliminary
router.delete('/delete/:_id', (req, res) => {
    Sale.deleteOne({isbn: req.params._id})
        .exec()
        .then(() => {
            res.status(201).send('sale Deleted.')
        })
        .catch((err) => { console.log(err);
        })
})




// This was just test code
router.get('/get', async (req, res) => {
    
    // without cursor.
    const sales = await Sale.find({});
    try {

        console.log(sales.length);
        res.send(sales);
    } catch (error) {
        res.status(500).send(error);
    }

    // with cursor
    // const cursor = await Person.find()
    // cursor.forEach(function(myDoc) {
    //     console.log( myDoc ); 
    // })
})

module.exports = router;
