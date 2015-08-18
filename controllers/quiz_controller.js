var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId)
  .then(
    function(quiz) {
      if (quiz) {
        models.Quiz.find({
            where: { id: Number(quizId) },
            include: [{ model: models.Comment }]
        })
        .then(function(quiz) {
          req.quiz = quiz;
          next();
        })
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
exports.index = function(req, res, next) {
  var busqueda = { order: "pregunta ASC" };
  if (req.query.search)
    busqueda.where = {pregunta: {$like: '%'+req.query.search.replace(' ', '%')+'%'}};

  models.Quiz.findAll(busqueda)
  .then(
    function(quizes) {
      res.render('quizes/index', { "quizes": quizes, errors: [] });
    },
    function(err) {
      console.log('Error findAll '+err);
      next(err);
    }
  )
  .catch(function(error) { next(error);});
};

// GET /quizes/:quizId
exports.show = function(req, res, next) {
  res.render('quizes/show', { "quiz": req.quiz, errors: [] });
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res, next) {
  var respuesta = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    respuesta ='Correcto';
  }
  res.render('quizes/answer', { "quiz": req.quiz, "respuesta": respuesta, errors: [] });
};

// GET /quizes/new
exports.new = function(req, res, next) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta", tema: "O" }
  );

  res.render('quizes/new', {quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function(req, res, next) {
  var quiz = models.Quiz.build( req.body.quiz );

  // guarda en DB los campos pregunta y respuesta de quiz
  quiz
  .validate()
  .then(
    function(err) {
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      }else {
        quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then(
          function(data){
            //console.log(data);
            res.redirect('/quizes');  // res.redirect: Redirección HTTP a lista de preguntas
          },
          function(err) {
            console.log('Error save '+err);
            next(err);
          }
        );
      }
    }
  )
  .catch(function(error) { next(error);});
};

// GET /quizes/:id/edit
exports.edit = function(req, res, next) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res, next) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( 
          function(data){
            //console.log(data);
            res.redirect('/quizes'); // Redirección HTTP a lista de preguntas (URL relativo)
          },
          function(err) {
            console.log('Error save '+err);
            next(err);
          }
        );
      }     
    }
  )
  .catch(function(error) { next(error);});
};

// DELETE /quizes/:id
exports.destroy = function(req, res, next) {
  req.quiz
  .destroy()
  .then(
    function(data) {
      //console.log(data);
      res.redirect('/quizes');
    },
    function(err) {
     console.log('Error destroy '+err);
     next(err);
    }
  ).catch(function(error){next(error)});
};
