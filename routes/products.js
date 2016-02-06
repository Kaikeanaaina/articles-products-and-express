var express = require('express');
var fs = require('fs');
var router = express.Router();
//don't need ./../db jus ../db/products also no .js needed. Express knows.
//could also capitalize productModule to make it look like a class
var productModule = require('./../db/products.js');

router.get('/', function(request, response){
  productModule.getAll(function(err, products){
    if (err) return response.send('couldn\'t get all product');
    return response.render('products/index', {
      products: products
    });
  });
});

router.get('/new', function(request, response){
  return response.render('products/new');
});


router.get('/:id', function(request, response){
  var requestId =(request.params.id);
  //needs return put before all response.render in routes
  productModule.getById(requestId, function(err, product){
    if (err) return response.send('couldn\'t get product');
    return response.render('products/show', {
      product: product
    });
  });
});

router.get('/:id/edit', function(request, response) {
  var requestId = request.params.id;

  productModule.getById(requestId, function(err, product){
    if (err) return response.send('couldn\'t get product');
    return response.render('products/edit', {
      product: product
    });
  });
});

//Middleware for our POST request
function postValidation(request, response, next) {


  var postRequestValidation = ['name', 'price', 'inventory'];

  for(var i = 0; i < postRequestValidation.length ; i++){

    //here we are checking for all required keys for the POST
    if(!request.body.hasOwnProperty(postRequestValidation[i])){
      return response.send(false + ': needs to have name, price, and inventory keys');
    }
    //here we are checking to make sure there is a value assigned to
    //each key
    if(request.body[postRequestValidation[i] ].length === 0){
      return response.send(false + ": missing " + postRequestValidation + 'value');
    }
  }

  //this validates that request.body.price is a number
  if(isNaN(parseInt(request.body.price))){
    return response.send(false + ': price needs to be a number');
  }
  //this validates that request.body.inventory is a number
  if(isNaN(parseInt(request.body.inventory))){
    return response.send(false + ': inventory needs to be a number');
  }
  //If everything is 'good'
  next();
}

//here is our POST, first calls Middleware 'postValidation'
router.post('/new', postValidation, function(request, response){
  //After getting thru validation we buid the object to return to the
  //database.  We also increment the counter for the next ID
  var productObject = {
    'name': request.body.name ,
    'price' : parseInt(request.body.price) ,
    'inventory': parseInt(request.body.inventory) ,
  };

  //Here we call on the module we brought in from the products.js db
  //We pass in the productObject (an object we created)and a callback function which we pass in
  // 'err' as a variable that will be defined as either a new Error or as null
  // in db.
  productModule.add(productObject, function (err) {
    //if there is an error on the db side it will pass that error in with a message
    //to this function.  So on the db side a 'truthy' will be returned if errors
    if(err) { //with a truthy, this activates
      //here products.js on db side encountered an error and gave us back a message
      //which we put in our response.send below
      return response.send({
        success: false,
        message: err.message
      });

      //here the db side invoked the callback function passing in null, giving a
      //falsy activated the else below
    } else {

      return response.redirect("/products/");
    }
  });
});

function putValidation(request, response, next){

  // // Here we are checking to make sure they include an ID key
  // if(!request.body.hasOwnProperty('id')) {
  //   return response.send(false + ': Missing ID key');
  // }

  // //Here we are checking to make sure they have a value for the the ID key
  // if(request.body.id.length === 0) {
  //   return response.send(false + ': Missing values for id');
  // }

  for(var key in request.body){
    //by now we have validated an ID # to edit so are checking for
    //name, price, and inventory keys. Then checking for values to
    //those keys
    if(key === 'name'){
      //checking that there is a value
      if(request.body.name.length === 0) {
        return response.send(false + ': Missing values for name');
      }
    }
    if(key === 'price'){
      //checking that there is a value
      if(request.body.price === undefined) {
        return response.send(false + ': Missing values for price');
      }
    }
    if(key === 'inventory'){
      //checking that there is a value
      if(request.body.inventory === undefined) {
        return response.send(false + ': Missing values for inventory');
      }
    }
  }

    //this validates that request.body.price is a number
  if(isNaN(parseInt(request.body.price))){
    return response.send(false + ': price needs to be a number');
  }
  //this validates that request.body.inventory is a number
  if(isNaN(parseInt(request.body.inventory))){
    return response.send(false + ': inventory needs to be a number');
  }

  // //Here we are checking to make sure the url ID matched ID in the client's PUT Request
  // if(parseInt(request.params.id) !== parseInt(request.body.id)) {
  //   return response.send(false + ': Your url ID does not match your PUT ID');
  // }


  next();
}

router.put('/:id/edit', putValidation, function(request, response){
  var requestId = request.params.id;
  request.body.id = requestId;
  //this checks to see if the request.body had any of the keys

  //this is similar to POST passing in needed variables and a callback
  //function that will define 'err' as either an error or null (truthy or
  //falsey) on the db side
  productModule.editById(request.body,requestId, function(err,product){
    if(err) {
      return response.send({
        success: false,
        message: err.message
      });
      //falsey return from callback function
    } else {
      var putChange = product._id;
      console.log('successfully updated the product');
      return response.redirect('/products/'+putChange);
    }
  });
});

router.delete('/:id', function(request, response) {
  var requestId = request.params.id;

  //calls deleteProduct function in our db, passes ID # and cb func
  //see other routes for explanation of err/truthy & null/falsey

  productModule.deleteProduct(requestId, function (err,product) {
    if(err) {
      return response.send({
        success: fail,
        message: err.message
      });

    } else { //if this callback function returns falsey to error then returns
      //success with what the id# now show (null)
      //var deleteChange = productModule.getById(requestId);
      return response.redirect('/products/');
    }
  });
});






module.exports = router;