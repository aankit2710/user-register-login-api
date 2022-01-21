const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT;
const { findUserByUsername, findUserByEmail, addNewUser } = require('../mongoDb/user');


//Validate user schema
const userSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    address: Joi.string().required(),
    password: Joi.string().required().min(4)
});

const Register = async (req, res, next) => {
    // validate
    const userParam = req.body;

    const user = userSchema.validate(userParam);
    if (user.error) {
        console.log(user.error.message);
        return res.json({
            error: true,
            status: 400,
            message: user.error.message,
        });
    }

    var getUser = await findUserByUsername(userParam.userName);
    if (getUser.length) {
        res.json({
            error: true,
            status: 400,
            message: 'Username "' + userParam.userName + '" is already taken'
        });
    }

    getUser = await findUserByEmail(userParam.email);
    if (getUser.length) {
        res.json({
            error: true,
            status: 400,
            message: 'Email "' + userParam.email + '" is already taken'
        });
    }

    // hash password

    userParam.password = bcrypt.hashSync(userParam.password, 10);

    // save user
    const newUser = await addNewUser(userParam);

    res.json({
        status: 200,
        data: newUser
    });
}

const Signin = async (req, res) => {
    const { userName, password } = req.body;

    // we made a function to verify our user login
    const response = await VerifyUserLogin(userName, password);

    if (response.status === "OK") {
        // storing our JWT web token as a cookie in our browser
        res.cookie("token", token, { maxAge: 12 * 60 * 60 * 1000, httpOnly: true }); // maxAge: 12 hours
        // res.redirect('/');
        res.json({
            message: "you are logged in successfully!",
            token: token,
            user: response.user,
        });
    } else {
        res.json(response);
    }
};

const VerifyUserLogin = async (userName, password) => {
    try {
        const user = await findUserByUsername(userName);
        if (!user.length) {

            return { status: "error", error: "user not found" };
        }

        if (await bcrypt.compare(password, user[0].password)) {
            // creating a JWT token
            token = jwt.sign({ id: user[0]._id, username: user[0].userName, type: "user" },
                JWT_SECRET
            );
            return { status: "ok", toekn: token, userDetails: user };
        }
        return { status: "error", error: "invalid password" };
    } catch (error) {
        return { status: "error", error: error.message };
    }
};

module.exports = { Register, Signin };