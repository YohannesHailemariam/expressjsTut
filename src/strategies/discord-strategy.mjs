import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

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
                done(null, newSavedUser);
            }
        } catch (err) {
            console.log(err);
        }
    }
   )
)