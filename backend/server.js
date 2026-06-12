/* ====================================================
   IMPORT PACKAGES
==================================================== */

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const multer = require("multer")
const PDFDocument = require("pdfkit")
const mammoth = require("mammoth")
const fs = require("fs")
const path = require("path")

/* ====================================================
   CREATE EXPRESS APP
==================================================== */

const app = express()

/* ====================================================
   MIDDLEWARE
==================================================== */

app.use(cors())
app.use(express.json())

/* ====================================================
   STATIC UPLOADS FOLDER
==================================================== */

app.use(
    "/uploads",
    express.static(
        path.join(__dirname,"uploads")
    )
)

/* ====================================================
   CONNECT MONGODB
==================================================== */

mongoose.connect(
    "YOUR_MONGODB_CONNECTION_STRING"
)

mongoose.connection.once("open",()=>{

    console.log("✅ MongoDB Connected")

})

/* ====================================================
   DATABASE SCHEMA
==================================================== */

const SearchSchema =
new mongoose.Schema({

    title:String,
    description:String,
    url:String

})

const Search =
mongoose.model(
    "Search",
    SearchSchema
)

/* ====================================================
   FILE UPLOAD SETUP
==================================================== */

const upload =
multer({
    dest:"uploads/"
})

/* ====================================================
   SEARCH API
==================================================== */

app.get("/search",async(req,res)=>{

    try{

        const query =
        req.query.q

        const results =
        await Search.find({

            title:{
                $regex:query,
                $options:"i"
            }

        })

        res.json(results)

    }catch(error){

        res.status(500).json({
            message:"Search Error"
        })

    }

})

/* ====================================================
   SEARCH SUGGESTIONS API
==================================================== */

app.get("/suggest",async(req,res)=>{

    try{

        const query =
        req.query.q

        const suggestions =
        await Search.find({

            title:{
                $regex:query,
                $options:"i"
            }

        }).limit(5)

        res.json(suggestions)

    }catch(error){

        res.status(500).json({
            message:"Suggestion Error"
        })

    }

})

/* ====================================================
   ADD DATA API
==================================================== */

app.post("/add",async(req,res)=>{

    try{

        const item =
        new Search({

            title:req.body.title,
            description:req.body.description,
            url:req.body.url

        })

        await item.save()

        res.json({
            message:"✅ Data Saved"
        })

    }catch(error){

        res.status(500).json({
            message:"Save Error"
        })

    }

})

/* ====================================================
   IMAGE UPLOAD
==================================================== */

app.post(
    "/uploadImage",
    upload.single("image"),
    (req,res)=>{

        res.json({
            message:"✅ Image Uploaded",
            file:req.file.filename
        })

})

/* ====================================================
   IMAGE TO PDF
==================================================== */

app.post(
    "/convertPdf",
    upload.single("image"),
    (req,res)=>{

        const doc =
        new PDFDocument()

        const pdfPath =
        `uploads/${Date.now()}.pdf`

        doc.pipe(
            fs.createWriteStream(pdfPath)
        )

        doc.text("QueryNest PDF")

        doc.image(req.file.path,{
            fit:[300,300]
        })

        doc.end()

        res.json({
            message:"✅ PDF Created"
        })

})

/* ====================================================
   DOC READER
==================================================== */

app.post(
    "/readDoc",
    upload.single("doc"),
    async(req,res)=>{

        const result =
        await mammoth.extractRawText({

            path:req.file.path

        })

        res.json({
            text:result.value
        })

})

/* ====================================================
   START SERVER
==================================================== */

const PORT = 5000

app.listen(
    PORT,
    "0.0.0.0",
    ()=>{

        console.log(
            `🚀 QueryNest Running On Port ${PORT}`
        )

})