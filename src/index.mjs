import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [{ id: 1, username: "anson", displayName: "Anson"},
                   { id: 2, username: "jack", displayName: "Jack"},
                   { id: 3, username: "adam", displayName: "Adam"}]

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})

app.get("/", (req,res) => {
    res.status(201).send({ msg: "Hello" });
});

app.get("/api/users", (req,res) => {
    res.send(mockUsers);
});

app.get("/api/users/:id", (req,res) => {
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);
    if (isNaN(parsedId)) return res.status(400).send({ msg: "Bad Request. Invalid ID." });
    const findUser = mockUsers.find((user) => user.id === parsedId);
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

app.get("/api/products", (req,res) => {
    res.send([{ id:123, name: "chicken breast", price: 12.99 }]);
});

