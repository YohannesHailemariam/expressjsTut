import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";


mongoose
    .connect("mongodb://localhost/expTut")
    .then(() => console.log("connected to Database"))
    .catch((err) => console.log(`Error: ${err}`));

const app = createApp();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});



//client_secret = rG8JnXtaP22IuIuB6CWVOydKqQzuiPsr
//client_id = 1268870997377945653
//redirect_url = http://localhost:5000/api/auth/discord/redirect
