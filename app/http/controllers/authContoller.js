const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
function authControllers() {
    const _getRedirectUrl = (req) =>{
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders';
    }
    return{
        login(req,res){
            res.render('auth/login')
        },
        postLogin(req, res, next){

            const { email, password } = req.body;
            //validate request
            if(!email || !password){
                req.flash('error' , 'All fields are required');
                return res.redirect("/login");
            } //here we are using validation if user has not put an email an password and he his logging in side


            passport.authenticate('local', (err, user, info) =>{
                if(err){
                    req.flash("error", info.message);
                    return next(err)
                }

                if(!user){
                    req.flash("error", info.message)
                    return res.redirect('/login');
                }

                req.logIn(user, (err) =>{
                    if(err){
                        req.flash('error', info.message);
                        return next(err); 
                    }
                    
                    return res.redirect(_getRedirectUrl(req));
                })
            })(req, res, next);  //!!!IMPORTANT we write this bcz the passport.authenticate return a fuction which we have to call
        },
        register(req,res){
            res.render('auth/register');
        },
        async postRegister(req,res){
            const { name, email, password } = req.body;
            //validate request
            if(!name || !email || !password){
                req.flash('error' , 'All fields are required'); 
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect("/register");
            }

            //Check if eamil exist
            User.exists({ email : email }, (err,result) =>{
                if(result){
                    req.flash('error' , 'Email already taken'); 
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect("/register");
                }
            })

            //Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            //Create a user
            const user = new User({
                name, //It is same as name : name
                email,//It is same as email : email
                password : hashedPassword
            })

            user.save().then((user) =>{
                //Login as automatcially if user get registered
                return res.redirect("/")
            }).catch(err =>{
                req.flash('error' , 'Something went wrong '); 
                return res.redirect("/register");
            })

            console.log(req.body);
        },
        logout(req, res){
            req.logout();
            return res.redirect('/login');
        }
    }
}

module.exports = authControllers;