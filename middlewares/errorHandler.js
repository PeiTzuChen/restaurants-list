module.exports = (error,req,res,next)=> {
  console.error('印出錯誤',error);
  req.flash("error", error.errorMessage || '伺服器錯誤');
  res.redirect("back");
  next()
}