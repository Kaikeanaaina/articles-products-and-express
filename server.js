var express = require('express');
var app = express();
var productsRouter = require('./routes/products.js');
var arcticlesRouter = require('./routes/articles.js');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');



// middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride(function(request,response){
  if ((request.body) && (typeof request.body === 'object') && ('_method' in request.body)){
    var method = request.body._method;
    delete request.body._method;
    return method;
  }
}));

app.set('views', './templates');
app.set('view engine', 'jade');
console.log(app.get('view engine'));
app.use('/products', productsRouter);
app.use('/articles', arcticlesRouter);



app.get('/',function(request,response){
  response.send('hello world!');
  response.end();
});

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Connected to', port);
});