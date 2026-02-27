import { usersService } from "../services/index.js";
import passport from "passport";
import local from "passport-local";
import { createHash, isValidPass } from "../tools/utils.js";


const localStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("signin", new localStrategy(
        { passReqToCallback: true, usernameField: "dni", passwordField: "password" },
        async (req, username, password, done) => {
            const { first_name, last_name, email, birth_date, dni, tel_contact } = req.body;
            
            try {
                const user = await usersService.getUserByDni(dni);
                if (user.length) return done(null, false, { messages: "El Usuario ya existe." });
                
                await usersService.addUser({
                    first_name,
                    last_name,
                    email,
                    birth_date,
                    user_password: createHash(password),
                    dni,
                    tel_contact
                });
                const userUpdated = await usersService.getUserByDni(dni);
                return done(null, userUpdated[0]);
            } catch (error) {                
                return done(error, null);
            }
        }
    ));

    passport.use("login", new localStrategy(
        { usernameField: "dni", passwordField: "password" },
        async (dni, password, done) => {
            
            try {
                const user = await usersService.getUserByDni(dni);

                if (!user.length) return done(null, false, { messages: "El Usuario no existe." });
                if (!isValidPass(password, user[0].user_password)) return done(null, false, { messages: "Usuario o contraseña incorrecto." });
                
                return done(null, user[0])
            } catch (error) {
                return done(error, null);
            }
        }
    ));


    passport.serializeUser((user, done) => {
        done(null, user.dni);
    });

    passport.deserializeUser(async (user, done) => {
        try {
            const userDeserialized = await usersService.getUserByDni(user.dni);
            done(null, userDeserialized);
        } catch (error) {
            done(error, null);
        }
    });
};



export default initializePassport;