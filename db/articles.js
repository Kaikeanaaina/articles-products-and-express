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

  function _add(articleObject, callback){
    //here we are checking to make sure there are no duplicate values
    //in our array
    var filterArticlesArray = articlesArray.filter(function(article) {
      return (article !== null);
    });

    for (var x = 0; x < filterArticlesArray.length; x++) {

      if(articleObject.title === filterArticlesArray[x].title) {
        return callback(new Error(': this article has already been posted'));
      }
    }

    articlesArray.push(articleObject);
    callback(null);
  }

  function _getAll() {
    //here we are filtering out the Null in the array because when we ran
    //a Delete request it erase the object and puts null in its place.  Then
    //Jade tries to render the index page again but doesn't know what to do with
    //null
    var filterArticlesArray = articlesArray.filter(function (article) {
      //filter goes thru each product in productArray and asks if it is 'not'
      //null. For every item that is not null it returns true.
      return (article !== null);
    });
    //filter puts all 'true' items in an array which is saved in line 39
    //as filterProdArray and returned below
    return filterArticlesArray;
  }

  function _getById(requestId){
    for(var i = 0 ; i < articlesArray.length ; i++){
      if(articlesArray[i].title === requestId){
        return articlesArray[i];
      }
    }
  }

  function _editByName(requestBody, callback){

    for(var i = 0 ; i < articlesArray.length ; i++){
      if(articlesArray[i].title === requestBody.title){
        for(var key in requestBody){
          if(key === 'title'){
            articlesArray[i].title = requestBody.title;
            articlesArray[i].urlTitle = encodeURI(requestBody.title);
          }
          if(key === 'author'){
            articlesArray[i].author = requestBody.author;
          }
          if(key === 'body'){
            articlesArray[i].body = requestBody.body;
          }
        }
      }
    }

    callback(null);
  }

  function _deleteArticle(requestBody, callback){

    for(var i = 0 ; i < articlesArray.length ; i++){
      if(articlesArray[i].title === requestBody){
        articlesArray[i] = null;
      }
    }

    callback(null);
  }

  return{
    getAll:_getAll,
    add:_add,
    getById:_getById,
    editByName:_editByName,
    deleteArticle:_deleteArticle

  };
})();