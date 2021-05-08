module.exports = {
  //checkAuthenticated
  checkAuthenticated:async function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/admins/login/public");
  },
  //checkNotAuthenticated
  checkNotAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  },
};
