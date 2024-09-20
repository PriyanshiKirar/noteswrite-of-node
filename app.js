const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
// const port = 3000; // define the port to use

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {

    var arr=[]
    fs.readdir(`./files`, function(err, files) {
        files.forEach(function(file){
            var data=fs.readFileSync(`./files/${file}`,"utf-8");
            arr.push({name:file, content:data})
        })
        // if (err) return res.status(500).send(err);
    //   else  res.render("index", { files });
    res.render("index",{files:arr})
    console.log(files)

    });
});

app.get("/read/:filename",function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,data){
        res.render("read",{filename:req.params.filename,data:data})
    })
})
app.get("/delete/:filename",function(req,res){
fs.unlink(`./files/${req.params.filename}`,function(err){
     res.redirect("/")
})
})

app.get('/edit/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render("edit",{ filename:req.params.filename, filedata: filedata })
    })
})


app.post("/update/:filename",function(req,res){
    fs.writeFile(`./files/${req.params.filename}`, req.body.details, function(err){
     
        res.redirect("/");
    });
});
app.post('/create', function(req, res) {
    // console.log(req.body);
    var filename = req.body.name.split(' ').join('') + '.txt';
    fs.writeFile(`./files/${filename}`,req.body.details, function(err) {
        if (err) return res.status(500).send(err);
        res.redirect("/");
    });
});

app.listen(3000, function() {
    console.log("Server is running on port");
});

