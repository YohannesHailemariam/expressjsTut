import { Router } from "express";
import { 
         query, 
         validationResult, 
         checkSchema, 
         matchedData 
        } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import session from "express-session";
import {User} from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";

const router = Router();

router.get(
    "/api/users", 
    query('filter')
        .isString()
        .withMessage("must be string")
        .notEmpty()
        .withMessage("Must not be empty")
        .isLength({ min: 3, max: 10 })
        .withMessage("Must be at least 3-10 characters"), 
        (req,res) => {
            console.log(req.session);
            console.log(req.session.id);
            req.sessionStore.get(req.session.id, (err, sessionData) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log("Inside Session Store Get")
                console.log(sessionData);
            })
            const result = validationResult(req);
            console.log(result);  
            const {
                query: { filter, value },
            } = req;
            if (filter && value) return res.send(
                mockUsers.filter((user) => user[filter].includes(value))
            );

            return res.send(mockUsers);
        }
)

router.get("/api/users/:id", resolveIndexByUserId, getUserByIdHandler);

router.post(
    "/api/users",
    checkSchema(createUserValidationSchema),
    createUserHandler
 );

router.put("/api/users/:id", resolveIndexByUserId, (req,res) => {
    const { body, findUserIndex } = req;

    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200); 
})

router.patch('/api/users/:id', resolveIndexByUserId , (req,res) => {
    const { body, findUserIndex } = req;

    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
} )

router.delete('/api/users/:id', resolveIndexByUserId, (req,res) => {
    const { findUserIndex } = req;
    
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
})


export default router;