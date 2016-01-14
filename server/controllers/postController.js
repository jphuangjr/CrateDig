var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');

module.exports = {
  // This is for our home page
  allProducts: function(req, res) {
    // This is necessary because our Post schema 
    // contains both products and responses
    db.Post.findAll({
      where: {
        isAResponse: false
      },
      //This creates the rows that are references instead of 
      //just the numbers
      include: [db.User]
    })
    //Format the array of questions into objects that our
    //front end will use
    .then(function(products) {
      var formattedProducts = products.map(function(product) {
        return {
          id: product.id,
          title: product.title,
          text: product.text,
          isAResponse: false,
          points: product.points,
          responses: product.responses,
          createdAt: product.createdAt,
          user: product.User.name,
          imgUrl: product.User.picture,
          updatedAt: product.updatedAt
        };
      });

      products = {};
      products.results = formattedProducts;
      res.json(products);
    });
  },

  readPost: function(req, res) {
    var pid = req.params.id;

    db.Post.findById(pid, {
      include: [db.User]
    })
    .then(function(question) {
      var formattedProduct = [{
        id: question.id,
        title: question.title,
        text: question.text,
        isAResponse: false,
        points: question.points,
        //Number of responses
        responses: question.responses,
        createdAt: question.createdAt,
        user: question.User.name,
        userid: question.User.id,
        imgUrl: question.User.picture,
        updatedAt: question.updatedAt
      }];
      // This is what we do to find the responses
      db.Post.findAll({
        where: {
          postId: pid
        },
        include: [db.User]
      })
      .then(function(responses) {
        var formattedResponses = responses.map(function(response) {
          return {
            id: response.id,
            text: response.text,
            isAResponse: true,
            points: response.points,
            PostId: pid,
            user: response.User.name,
            userid: response.User.id,
            createdAt: response.createdAt,
            imgUrl: response.User.picture
          };
        });

        productAndResponses = {};
        productAndResponses.results = formattedProduct.concat(formattedResponses);
        res.json(productAndResponses);
      });
    });
  },


  newPost: function(req, res) {
    //Used for Post/Response
    var title = req.body.title;
    var text = req.body.text;
    var uid = req.body.id_user;
    //Prod Only
    var link = req.body.link || null;
    //Response Only
    //Check to see when we get these and how we get them
    var pid = req.body.id_question || null;
    //How are we given type?
    db.Post.create({
      title: title,
      text: text,
      link: link,
      UserId: uid,
      PostId: pid,
      Type: (pid) ? 'Response' : 'Post' 

    })
    .then(function(post) {
      res.status(201).json(post);
    });
  },

  deletePost: function(req, res) {
    //How do we get this stuff without request?
    var pid = req.params.id;
    //Need this to authorize deletion
    var reqName = req.user.profile.emails[0].value;

    //This 

    // db.Post.findById(pid)
    // .then(function(post) {
    //   post.destroy()
    //   .then(function(id) {
    //     // if id
    //     res.sendStatus(204);
    //   });
    // });


    db.Post.findById(pid)
    .then(function(post) {
      return post.destroy();
    })
    .then(function(id) {
      if (id) {
        res.sendStatus(204);
      }
    });
  },
  likePost: function(req, res) {
    //Not done refactoring like yet


  }
};




















