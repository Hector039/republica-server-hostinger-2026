import passport from "passport";

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy,
            {
                successRedirect: "http://82.25.65.122/",
                failureRedirect: "http://82.25.65.122/"
            },
            function (error, user, info) {
                if (error) return next(error);
                
                if (!user) {
                    return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
                }
                req.user = user;
                next();
            })(req, res, next);
    }
}
