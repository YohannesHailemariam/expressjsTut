import express from "express";
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo"
import "./strategies/local-strategy.mjs";

const app = express();

mongoose
    .connect("mongodb://localhost/expTut")
    .then(() => console.log("connected to Database"))
    .catch((err) => console.log(`Error: ${err}`))

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(session({
    secret: 'anson the dev',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    }),
}));

app.use(passport.initialize()); 
app.use(passport.session());

app.use(routes);

app.post('/api/auth', 
    passport.authenticate("local"),
    (req, res) => {
        res.sendStatus(200);
    }
);

app.get("/api/auth/status", (req, res) => {
    console.log(`Inside /auth/status endpoint`);
    console.log(req.user);
    console.log(req.session);
    console.log(req.sessionID);
    return req.user ? res.send(req.user) : res.sendStatus(401);
})

app.post("/api/auth/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
    req.logOut((err) => {
        if (err) return res.sendStatus(400);
        res.send(200);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

app.get("/",
    (req,res) => {
        console.log(req.session);
        console.log(req.session.id);
        req.session.visited = true;
        res.cookie("hello", "world", { maxAge: 30000, signed: true });
        res.status(201).send({ msg: "Hello" });
});

app.post('/api/auth', (req, res) => {
    const { 
        body: { username, password }, 
    } = req;
    const findUser = mockUsers.find((user) => user.username === username);
    if (!findUser || findUser.password !== password) 
        return res.status(401).send({ msg: 'BAD CREDENTIALS' });

    req.session.user = findUser;
    return res.status(200).send(findUser);
})

app.get('/api/auth/status', (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
    }); 
    return req.session.user ? res.status(200).send(req.session.user)
    : res.status(401).send( { msg: "Not Authenticated" } );
})

app.post("/api/cart", (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    const { body: item } = req;
    const { cart } = req.session;
    if (cart) {
        cart.push(item);
    }
    else {
        req.session.cart = [item];
    }
    return res.status(201).send(item);
})

app.get('/api/cart', (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    return res.send(req.session.cart ?? []);
})


//client_secret = rG8JnXtaP22IuIuB6CWVOydKqQzuiPsr
//client_id = 1268870997377945653
//redirect_url = http://localhost:5000/api/auth/discord/redirect
