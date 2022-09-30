// jshint esversion:6

const exp = require("express");
const bodyp = require("body-parser");
// const date = require(__dirname + "/date.js");
const mong = require("mongoose");
// const e = require("express");
const _ = require("lodash");

const app = exp();

mong.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true})

const itemschema = mong.Schema({
    name: String
});

const itemModel = mong.model("item",itemschema);

app.set('view engine', 'ejs');

app.use(bodyp.urlencoded({ extended: true }));

app.use(exp.static("public"))

// creating some items,
const wake = new itemModel({name: "Wake up"});
const brush = new itemModel({name: "Brush"});
const code = new itemModel({name: "Coding"});
const itemss= [wake,brush,code];

const listSchema = mong.Schema({
    name: String,
    items: [itemschema]
});

const listModel = mong.model("list",listSchema);

app.get("/", function (req, res) {
    
    itemModel.find({},function(err,items){    
        // if(items.length===0){
        //     itemModel.insertMany(itemss,function(err){
        //         if(err){
        //             console.log(err);
        //         }else{
        //             console.log("Successfully added");
        //         }
        //     });            
        //     res.redirect("/");
        // }
        // else{
            res.render("list", { todday: "Today", naaya: items })
        // }
    })
    // const dayy = date.getDate();
    // var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    // if(d.getDay()===0||d.getDay()===6){

    //     var dayy='Weekend ,i.e, '+weekday[d.getDay()];
    //     // res.sendFile(__dirname+"/weekend.html")

    // }

    // else{

    //     var dayy='Weekday ,i.e, '+weekday[d.getDay()];
    //     // res.write("<h1>its not a weekend ,its "+weekday[d.getDay()]+"</h1>")
    //     // res.send();
    //     // res.sendFile(__dirname+"/weekday.html");

    // }
    // res.render("list", { todday: dayy, naaya: items })
    // res.render("list",{ weedat : weekday[d.getDay()]})

});

app.post("/", function (req, res) {

    const itemN = req.body.neww;
    const itemadd = new itemModel({
        name: itemN
    });
    const listna = req.body.button;
    if(listna==="Today"){
        itemadd.save();
        res.redirect('/');
    }else{
        listModel.findOne({name: listna}, function(err,foundlist){
            foundlist.items.push(itemadd);
            foundlist.save();
            res.redirect("/"+listna);
        })
    }

    // item = req.body.neww;
    // if (req.body.button === "Work") {
    //     workitems.push(item);
    //     res.redirect("/work")
    // }
    // else {
    //     items.push(item);
    //     res.redirect("/");
    // }
    // // console.log(req.body);

})

app.post("/delete",function(req,res){
    const listna = req.body.tot;
    // console.log(listna);
    if(listna==="Today"){
        itemModel.deleteOne({_id: req.body.checkbox},function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Deleted Successfully!!!");
            }
        });
        res.redirect("/");
    }else{
        listModel.findOneAndUpdate({name: listna},{$pull: {items: {_id: req.body.checkbox}}},function(err,foundlist){
            if(!err){
                res.redirect("/"+listna);
            }
        });
    };
});

app.get("/:ask", function (req, res) {
    if(_.capitalize(req.params.ask)==="Today"){
        res.redirect("/");
    }
    else{
        listModel.findOne({name: _.capitalize(req.params.ask)},function(err,foundlist){
            if(!err){
                if(!foundlist){
                    const list = new listModel({
                        name: _.capitalize(req.params.ask),
                        items: itemss
                    });
    
                    list.save();
                    res.redirect("/"+_.capitalize(req.params.ask));
                }
                else{
                    res.render("list",{todday: foundlist.name, naaya: foundlist.items})
                }
            }
        })
    }
})

app.get("/about", function (req, res) {
    res.render("about");
})


app.listen(3000, function () {
    console.log("Server started at the port 3000")
});