module.exports = {
  //checkAuthenticated
  checkAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/admins/login");
  },
  //checkNotAuthenticated
  checkNotAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  },
};
