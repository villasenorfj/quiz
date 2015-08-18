var models = require('../models/models.js');

// GET /quizes/index
exports.show = function(req, res, next) {
  var stats = {};

  models.Quiz.count()
  .then(
    function(quizes) {
      stats.quizes = quizes;
      
      models.Comment.count()
	  .then(
	    function(comments) {
	      stats.comments = comments;
	      stats.medium = stats.comments / stats.quizes;

	      var busqueda = { attributes: ["QuizId"], group: ["QuizId"] };
	      models.Comment.findAll(busqueda)
		  .then(
		    function(quizesWithComments) {
			  stats.quizesWithComments = quizesWithComments.length;
			  stats.quizesWithoutComments = stats.quizes - stats.quizesWithComments;
		      res.render('stats/show', { "stats": stats, errors: [] });
		    }
		  )
		  .catch(function(error) { next(error);});
	    }
	  )
	  .catch(function(error) { next(error);});
	}
  )
  .catch(function(error) { next(error);});

};
