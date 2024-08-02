import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    console.log(user)
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log(`Inside Deserializer`)
    console.log(`Deserializing User ID: ${id}`);
    try {
        const findUser = await User.findById(id);
        return findUser ? done(null, findUser) : done(null, null);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy({
        clientID: '1268870997377945653',
        clientSecret: 'rG8JnXtaP22IuIuB6CWVOydKqQzuiPsr',
        callbackURL: 'http://localhost:5000/api/auth/discord/redirect',
        scope: ["identify"],
    }, 
    async (accessToken, refreshToken, profile, done) => {
        let findUser;
        try {
            findUser = await DiscordUser.findOne({ discordId: profile.id });
        } catch (err) {
            return done(err, null);
        }
        
        try {
            if (!findUser) {
                const newUser = new DiscordUser({
                    username: profile.username,
                    discordId: profile.id,
                })
                const newSavedUser = await newUser.save();
                return done(null, newSavedUser);
            }
            return done(null, findUser);
        } catch (err) {
            console.log(err);
            return done(err, null);
        }
    }
   )
)