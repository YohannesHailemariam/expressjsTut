import express from "express";

const app = express();

app.use(express.json())

const PORT = process.env.PORT || 3000;

const mockUsers = [{ id: 1, username: "anson", displayName: "Anson"},
                   { id: 2, username: "jack", displayName: "Jack"},
                   { id: 3, username: "adam", displayName: "Adam"},
                   { id: 4, username: "tina", displayName: "Tina"},
                   { id: 5, username: "jason", displayName: "Jason"},
                   { id: 6, username: "henry", displayName: "Henry"},
                   { id: 7, username: "marilyn", displayName: "Marilyn"}
                ]

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})

app.get("/", (req,res) => {
    res.status(201).send({ msg: "Hello" });
});

app.get("/api/users", (req,res) => {
    console.log(req.query);
    const {
        query: { filter, value },
    } = req;
    if (filter && value) return res.send(
        mockUsers.filter((user) => user[filter].includes(value))
    );

    return res.send(mockUsers);
});

app.post('/api/users', (req,res) => {
    const { body } = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body }
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
})
 
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

app.put("/api/users/:id", (req,res) => {
    const { body, 
        params: { id }, 
    } = req;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    
    if (findUserIndex === -1) return res.sendStatus(404);

    mockUsers[findUserIndex] = { id: parsedId, ...body };
    return res.sendStatus(200); 
})

app.patch('/api/users/:id', (req,res) => {
    const {
        body,
        params: { id },
    } = req;

    const parsedId = parseInt(id); 
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId );
    if (findUserIndex === -1) return res.sendStatus(404);
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.sendStatus(200);
} )

