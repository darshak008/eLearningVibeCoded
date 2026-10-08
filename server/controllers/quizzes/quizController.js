const Quiz = require('../../models/Quiz');
const QuizAttempt = require('../../models/QuizAttempt');
const AppError = require('../../utils/AppError');

exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create({ ...req.body, course: req.params.courseId });
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title');
    if (!quiz) return next(new AppError('Quiz not found', 404));

    const attempts = await QuizAttempt.find({
      student: req.user._id,
      quiz: quiz._id,
    }).sort('-attemptNumber');

    res.status(200).json({ success: true, quiz, attempts });
  } catch (error) {
    next(error);
  }
};

exports.getLessonQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
    if (!quiz) return next(new AppError('No quiz found for this lesson', 404));

    const attempts = await QuizAttempt.find({
      student: req.user._id,
      quiz: quiz._id,
    }).sort('-attemptNumber');

    res.status(200).json({ success: true, quiz, attempts });
  } catch (error) {
    next(error);
  }
};

exports.submitAttempt = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return next(new AppError('Quiz not found', 404));

    const previousAttempts = await QuizAttempt.countDocuments({
      student: req.user._id,
      quiz: quiz._id,
    });

    if (previousAttempts >= quiz.maxAttempts) {
      return next(new AppError('Maximum attempts reached', 400));
    }

    const { answers, timeTaken } = req.body;
    let score = 0;
    let totalPoints = 0;

    const processedAnswers = quiz.questions.map((question) => {
      totalPoints += question.points;
      const userAnswer = answers?.find(
        (a) => a.questionId === question._id.toString()
      );

      let isCorrect = false;
      if (userAnswer) {
        if (question.type === 'mcq' || question.type === 'true-false') {
          isCorrect = userAnswer.answer === question.correctAnswer;
        }
      }

      if (isCorrect) score += question.points;

      return {
        questionId: question._id,
        answer: userAnswer?.answer || '',
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
      };
    });

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      quiz: quiz._id,
      course: quiz.course,
      answers: processedAnswers,
      score,
      totalPoints,
      percentage,
      passed,
      attemptNumber: previousAttempts + 1,
      startedAt: new Date(Date.now() - (timeTaken || 0) * 1000),
      completedAt: new Date(),
      timeTaken: timeTaken || 0,
    });

    res.status(201).json({ success: true, attempt });
  } catch (error) {
    next(error);
  }
};

exports.getAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.user._id, quiz: req.params.id })
      .sort('-attemptNumber');

    res.status(200).json({ success: true, attempts });
  } catch (error) {
    next(error);
  }
};
