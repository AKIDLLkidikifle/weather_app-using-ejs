const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.render("index");
})

app.post("/", function(req, res){
    const cityName = req.body.city;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=metric&appid=<your Api key>";
    https.get(url, function(response){
        response.on("data", function(data){
            const jsObject = JSON.parse(data);
            
            const temp = jsObject.main.temp+"°C";
            const description = jsObject.weather[0].description;
            const windSpeed = Math.round(3.6*(jsObject.wind.speed))+"km/hr";//change m/s to km/hr
            const humidity = Math.round(jsObject.main.humidity)+"%";
            const icon = jsObject.weather[0].icon;
            const imageUrl =  "https://openweathermap.org/img/wn/"+ icon +"@2x.png";

            res.render("output", {imageCloud: imageUrl, temp:temp, Description:description, wind:windSpeed, humidity:humidity});
        })
    })
   
})

app.listen(3000, function(){
    console.log("server is running on port 3000");
})
