const users = require('../models/usersSchema');
const moment = require("moment");
const csv = require('fast-csv');
const fs = require('fs');


//Register user
exports.userpost = async (req, res) => {
    const file = req.file.filename;
    const { fname, lname, email, mobile, gender, status, location } = req.body;
    if (!fname || !lname || !email || !mobile || !gender || !status || !location) {
        res.status(401).json("All Input field required");
    }

    try {
        const preuser = await users.findOne({ email: email });

        if (preuser) {
            res.status(401).json("user already exists");
        } else {
            const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
            const userData = new users({
                fname, lname, email, mobile, gender, status, location, profile: file, datecreated
            });
            await userData.save();
            res.status(201).json(userData);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.msg });
    }

}

//  Get All Users
exports.userget = async (req, res) => {
    const search = req.query.search || ""
    const gender = req.query.gender || ""
    const status = req.query.status || ""
    const sort = req.query.sort || ""
    const page = req.query.page || 1
    const ITEM_PER_PAGE = 4;

    const query = {
        fname: { $regex: search, $options: "i" }
    }
    if (gender !== "All") {
        query.gender = gender;
    }
    if (status !== "All") {
        query.status = status;
    }
    try {
        
        const skip = (page-1) * ITEM_PER_PAGE //(2-1)*4=4
        const count =await users.countDocuments(query);


        console.log(count);

        const usersdata = await users.find(query)
            .sort({ datecreated: sort === "new" ? -1 : 1 })
            .limit(ITEM_PER_PAGE)
            .skip(skip);

        const pageCount = Math.ceil(count/ITEM_PER_PAGE); // 8/4=2
        res.status(200).json({
            Pagination:{
                count,pageCount
            },
            usersdata
        })
    } catch (error) {
        console.log(error);
        res.status(401).json(error)
    }
}

//Get Single User
exports.getsingleuser = async (req, res) => {
    try {
        const { id } = req.params;
        const userdata = await users.findOne({ _id: id });
        return res.status(200).json(userdata)
    } catch (error) {
        console.log(error);
        return res.status(401).json(error)
    }
}

//Edit User
exports.useredit = async (req, res) => {
    const { id } = req.params;
    const { fname, lname, email, mobile, gender, status, location, user_profile } = req.body;
    const file = req.file ? (req.file.filename) : user_profile;

    const dateupdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateUser = await users.findByIdAndUpdate({ _id: id }, {
            fname, lname, email, mobile, gender, status, location, profile: file, dateupdated
        }, {
            new: true
        });
        await updateUser.save();
        return res.status(200).json(updateUser);
    } catch (error) {
        console.log(error);
        return res.status(401).json(error)
    }
}

//Delete user Data
exports.userdelete = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteuser = await users.findByIdAndDelete({ _id: id });
        return res.status(200).json(deleteuser)
    } catch (error) {
        console.log(error);
        return res.status(401).json(error)
    }
}

//Change Status
exports.userstatus = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    try {
        const userstatusupdate = await users.findByIdAndUpdate({ _id: id }, { status: data }, { new: true });
        return res.status(200).json(userstatusupdate);
    } catch (error) {
        console.log(error);
        return res.status(401).json(error)
    }
}

// Users Export data
exports.userExport = async (req, res) => {
    try {
        const usersdata = users.find();

        const csvStream = csv.format({ headers: true });

        if (!fs.existsSync("public/files/export")) {
            if (!fs.existsSync("public/files")) {
                fs.mkdirSync("public/files/")
            }

            if (!fs.existsSync("public/files/export")) {
                fs.mkdirSync("./public/files/export")
            }
        }

        const writablestream = fs.createWriteStream("public/files/exportusers.csv");

        csvStream.pipe(writablestream);

        writablestream.on("finish", function () {
            return res.status(200).json({
                downloadUrl: `http://localhost:6010/files/export/users.csv`
            })
        });

        if (usersdata.length > 0) {
            usersdata.map((user) => {
                csvStream.write({
                    FirstName: user.fname ? user.fname : "-",
                    LastName: user.lname ? user.lname : "-",
                    Email: user.email ? user.email : "-",
                    Phone: user.mobile ? user.mobile : "-",
                    Gender: user.gender ? user.gender : "-",
                    Status: user.status ? user.status : "-",
                    Profile: user.profile ? user.profile : "-",
                    Location: user.location ? user.location : "-",
                    DateCreated: user.datecreated ? user.datecreated : "-",
                    DateUpdated: user.dateupdated ? user.dateupdated : "-",
                })
            })
        }

        csvStream.end();
        writablestream.end();
    } catch (error) {
        return res.status(401).json(error)
    }
}
