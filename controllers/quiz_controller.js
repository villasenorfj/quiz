var models = require('../models/models.js');

// GET /quizes/index
exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index', { "quizes": quizes});
  },
  function(err) { console.log('Error findAll '+err) }
  )
};

// GET /quizes/:quizId
exports.show = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', { "quiz": quiz });
  },
  function(err) { console.log('Error find '+err) }
  )
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
 models.Quiz.findById(req.params.quizId).then(function(quiz) {
    if (req.query.respuesta === quiz.respuesta) {
      res.render('quizes/answer', { "quiz": quiz, respuesta: 'Correcto' });
    } else {
      res.render('quizes/answer', { "quiz": quiz, respuesta: 'Incorrecto'});
    }
  },
  function(err) { console.log('Error findAll '+err) }
  )
};
