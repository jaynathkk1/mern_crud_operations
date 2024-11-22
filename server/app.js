require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const cors = require("cors");
const router = require("./Routes/router");
const PORT = 6010


app.use(cors());
app.use(express.json());
app.use('/files',express.static("./public/files"));
app.use("/uploads",express.static('./uploads'));

app.use(router);

app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
})