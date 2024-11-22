const multer = require("multer");

//Storage config
const storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,"./uploads");
    },
    filename: (req,file,callback)=>{
        const filename = `images-${Date.now().toString()}.${file.originalname}`
        callback(null,filename);
    }
});

//File filter
const filefilter=(req,file,callback)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === "image/jpeg"){
        callback(null,true)
    }else{
        callback(null,false)
        return callback(new Error("only  .png .jpg & .jpeg format allowed "))
    }
}

const upload = multer({
    storage: storage,
    fileFilter: filefilter
});

module.exports = upload;