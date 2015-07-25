var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId)
  .then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      }else {
         next(new Error('No existe quizId=' + quizId))
      }
    },
    function(err) {
      console.log('Error findById '+err);
      next(err);
    }
  )
  .catch(function(error) { next(error);});
};

// GET /quizes/index
exports.index = function(req, res) {
  models.Quiz.findAll()
  .then(
    function(quizes) {
      res.render('quizes/index', { "quizes": quizes});
    },
    function(err) {
      console.log('Error findAll '+err);
      next(err);
    }
  )
  .catch(function(error) { next(error);});
};

// GET /quizes/:quizId
exports.show = function(req, res) {
  res.render('quizes/show', { "quiz": req.quiz });
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
  var respuesta = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    respuesta ='Correcto';
  }
  res.render('quizes/answer', { "quiz": req.quiz, "respuesta": respuesta});
};
