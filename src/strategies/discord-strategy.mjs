import passport from "passport";
import { Strategy } from "passport-discord";

passport.use(
    new Strategy({
        clientID: '1268870997377945653',
        clientSecret: 'rG8JnXtaP22IuIuB6CWVOydKqQzuiPsr',
        callbackURL: 'http://localhost:5000/api/auth/discord/redirect',
        scope: ["identify", "guilds"],
    }, () => {})
)