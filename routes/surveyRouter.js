const express = require("express");
const surveyRouter = express.Router();
const { mailSurveyForm } = require("../controller/survey");

surveyRouter.post("/mail-survey-form", mailSurveyForm);
module.exports = { surveyRouter };