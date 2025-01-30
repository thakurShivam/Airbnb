 
 const User=require("../models/user");

 module.exports.rendersignupform=(req,res)=>{
    res.render("users/signup.ejs");
};

 module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registerUser=await User.register(newUser,password);
        console.log(registerUser);
        //  direct login ...
        req.login(registerUser,(err)=>{
                if(err){
                     return next(err);
                }
                req.flash("Sucess","Welcome to Wandlust");
                res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


//  user middleware formm .....(login formm..)........


module.exports.renderLoginform=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("sucess","welcome back to wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


//  user logged out  formmm.......................


module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
        req.flash("sucess","you are logged out");
        res.redirect("/listings");
    });
}