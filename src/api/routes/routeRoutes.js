const { Router } = require('express');

const {
  postFastestRoute,
  postRecommendedRoute,
  postShadedRoute,
  postWeightedRoute
} = require('../controllers/routeController');

const routeRouter = Router();

routeRouter.post('/fastest', postFastestRoute);
routeRouter.post('/shaded', postShadedRoute);
routeRouter.post('/weighted', postWeightedRoute);
routeRouter.post('/recommended', postRecommendedRoute);

module.exports = { routeRouter };
