module.exports = (function(){
  var articlesArray = [
    {
      title: 'The Green Sea Turtle',
      body: 'There was a Hawaiian green sea turtle that lived on the beach',
      author: 'kai',
      urlTitle: 'The%20Green%20Sea%20Turtle'
    },
    {
      title: 'house of the rising sun',
      body: 'every morning starts crazy',
      author: 'salisbury',
      url: 'house%20of%20the%20rising%20sun'
    }

  ];

  var mongooseConnection = require('./mongoose.js');
  var Schema = mongooseConnection.Schema;


  // define a schema
  var articleSchema = new Schema({
    title: String,
    body: String,
    author: String
  })

// //compile a our model
var Articles = mongooseConnection.model('Articles', articleSchema);


function _add(articleObject, callback){
  var singleArticle = new Articles(
    {
      title: articleObject.title,
      body: articleObject.body,
      author: articleObject.author
    }
  );
  console.log(singleArticle, ' this is the db side');

  return singleArticle.save(function(err,singleArticle){
    if(err) return callback(err);
    console.log('succesfully added ' + singleArticle.name);
    return callback(null);
  });

    articlesArray.push(articleObject);
    callback(null);
  }


function _getAll(callback) {
  Articles.find({},function(err,articles){
    if(err) return callback(err);
    return callback(null,articles);
  });
}

function _getById(requestId,callback){
  Articles.findById(requestId,function(err,article){
    if(err) console.log(err);
    return callback(null,article);
  });
}

function _editById(requestBody, requestId, callback){
  Articles.findOneAndUpdate(
    {"_id": requestId },
    {
      $set:{title: requestBody.title, author: requestBody.author, body: requestBody.body}
    },
    function(err, article){
    if(err) return callback(err);
    return callback(null,article);
  });
}

function _deleteArticle(requestId,callback) {

  Articles.remove({"_id": requestId}, function(err,article){
    if(err) return callback(err);
    return callback(null,article);
  });

}

  return{
    getAll:_getAll,
    add:_add,
    getById:_getById,
    editById:_editById,
    deleteArticle:_deleteArticle

  };
})();