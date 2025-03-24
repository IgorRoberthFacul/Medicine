import express from "express";
import pkg from "body-parser";
import router from "./routes/router.js";
import cors from "cors";
import db from "./database/database.js"

const app = express();

app.use(cors());
const {json, urlencoded} = pkg;
app.use(json());
app.use(urlencoded({extended: true}));

app.use("/", router);

app.listen(3000, function(){
    console.log("Listening to port 3000");
});

app.use("/", router);