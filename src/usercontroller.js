const User = require("./usermodel");

const { validationResult } = require("express-validator");

var jwt = require("jsonwebtoken");


exports.signin = async (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;


    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }

    await User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "USER email does not exists",
            });
        }

        if (!user.autheticate(password)) {
            return res.status(401).json({
                status: "Error",
                statusCode: 401,
                message: "Email and password do not match",
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
            expiresIn: "24h",
        });
        console.log(token);
        res.cookie("token", token);
        const { _id, name, email } = user;
        res.redirect("/index");
        // return res.json({
        //   status: "Success",
        //   statusCode: 200,
        //   token,
        //   message: "SignIn Successfully",
        //   user: { _id, name, email },
        // });
    });
};


exports.signout = async (req, res) => {
    await res.clearCookie("token");
    res.json({
        message: "User signout successfully",
    });
};

exports.isSignedIn = async (req, res, next) => {

    const token = req.headers["authorization"];


    if (!token) {
        return res.status(403).json({
            Status: "Error",
            statusCode: 403,
            message: "No Token Provided",
        });
    }
    const bearer = token.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                Status: "Error",
                statusCode: 401,
                message: "Invalid Token",
            });
        }
        req.userId = decoded._id;

        next();
    });
};

//custom middlewares
exports.isAuthenticated = async (req, res, next) => {
    let checker =
        (await req.profile) && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            Status: "Error",
            statusCode: 403,
            error: "ACCESS DENIED",
        });
    }
    next();
};

