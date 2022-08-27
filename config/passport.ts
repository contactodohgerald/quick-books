import dotevn from 'dotenv';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import Users from '../app/models/UsersModel';

dotevn.config();

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET || ''
};

passport.use(new Strategy(opts, (jwt_payload: any, done: any) => {
    Users.findOne({ uniqueId: jwt_payload.userID }, (err: any, user: any) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));