import express from "express";

const app = express();

app.use(express.json())

const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
}

const resolveIndexByUserId = ( req, res, next) => {
    const { body, 
        params: { id }, 
    } = req;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    
    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
}
const PORT = process.env.PORT || 5000;

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

app.get("/",
    (req, res, next) => {
        console.log("Base URL");
        next();
    } , 
    (req, res, next) => {
        console.log("Base URL");
        next();
    } , 
    (req, res, next) => {
        console.log("Base URL");
        next();
    } , 
    (req, res, next) => {
        console.log("Base URL");
        next();
    } , 
    (req,res) => {
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

app.use(loggingMiddleware, (req, res, next) => {
    console.log("Finished Logging...");
    next();
})

app.post('/api/users', (req, res) => {
    const { body } = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body }
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
})
 
app.get("/api/users/:id", resolveIndexByUserId, (req,res) => {
    const { findUserIndex } = req;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

app.get("/api/products", (req,res) => {
    res.send([{ id:123, name: "chicken breast", price: 12.99 }]);
}); 

app.put("/api/users/:id", resolveIndexByUserId, (req,res) => {
    const { body, findUserIndex } = req;

    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200); 
})

app.patch('/api/users/:id', resolveIndexByUserId , (req,res) => {
    const { body, findUserIndex } = req;

    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
} )

app.delete('/api/users/:id', resolveIndexByUserId, (req,res) => {
    const { findUserIndex } = req;
    
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
})

