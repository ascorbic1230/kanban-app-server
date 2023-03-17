
const ROUTES_MAP = [
  ['auth', '../controllers/authController'],
  ['boards', '../controllers/boardController'],
]

const routes = (app) => {
  ROUTES_MAP.forEach(([route, controller]) => {
    app.use(`/api/v1/${route}`, require(controller));
  });
}

module.exports = routes;
