module.exports= (req,res,next) => {
 console.log("進入middleware"); 
res.locals.success = req.flash("success");
// res.locals.error_msg = req.flash("error")

console.log(res.locals.success);
 next()
}