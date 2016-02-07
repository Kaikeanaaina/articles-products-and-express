module.exports = (function () {

var mongooseConnection = require('./mongoose.js');
var Schema = mongooseConnection.Schema;


// define a schema
var productSchema = new Schema({
  name: String,
  price: Number,
  inventory: Number
})

// //compile a our model
var Products = mongooseConnection.model('Products', productSchema);


function _add(productObject, callback) {
  var singleProduct = new Products(
    {
      name: productObject.name,
      price: productObject.price,
      inventory: productObject.inventory
    }
  );

  return singleProduct.save(function(err,singleProduct){
    if(err) return callback(err);
    console.log('succesfully added ' + singleProduct.name);
    return callback(null);
  });
}


function _getAll(callback) {
  Products.find({},function(err,products){
    if(err) return callback(err);
    return callback(null,products);
  });
}

function _editById(requestBody, requestId, callback){
  Products.findOneAndUpdate(
    {"_id": requestId },
    {
      $set:{name: requestBody.name, inventory: requestBody.inventory, price: requestBody.price  }
    },
    function(err, product){
    if(err) return callback(err);
    return callback(null,product);
  });
}


function _getById(requestId, callback){
  Products.findById(requestId,function(err,product){
    if(err) console.log(err);
    return callback(null,product);
  });
}


function _deleteProduct(requestId,callback) {

  Products.remove({"_id": requestId}, function(err,product){
    if(err) return callback(err);
    return callback(null,product);
  });

}


//all the methods we are exposing/exporting on our productModule

  return {
    add: _add,
    getAll: _getAll,
    getById: _getById,
    editById: _editById,
    deleteProduct: _deleteProduct
  };
})();
