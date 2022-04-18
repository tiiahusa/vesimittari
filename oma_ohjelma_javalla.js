// Tehdään express-ohjelma nimeltä "app"
var express = require("express")
var app = express()
//Otetaan projektin toinen tiedosto (tietokannan ohjaus) käyttöön
//ja nimetään se "db" 
var db = require("./database.js")

//Tehdään "parseri", että saadaan tietokannan tiedot toimimaan?
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Haetaan Herokulta porttinumero
var HTTP_PORT = process.env.PORT || 8080

// Käynnistetään serveri
app.listen(HTTP_PORT, () =>{
    //Teksti konsoliin
    console.log("Serveri käynnissä, portti %PORT%".replace("%PORT%", HTTP_PORT))
}
)

// Toiminnallisuus
app.get("/", (req, res, next) => {
    res.json({"viesti":"OK"})
})

// Haetaan kaikki tietokannan rivit
app.get("/api/measurements", (req, res, next) => {
    var select = "SELECT * FROM mittaus;"

    //Poimitaan tietokannan tulos
    db.all(select, (err, rows) => {
        if(err) {
            res.status(400).json({"virhe":err.message})
            return
        }
        res.json({
            "viesti":"onnistui!",
            "data":rows
        })
    })
})

//Poimitaan "postitettu" tieto tietokantaan, eli esim Postmanin kautta
//syötetty tieto
app.post("/api/measurements", (req, res, next)=> {

    // Luodaan virhelista
    var errors = []
    // Jos viestissä ei oo määritelty numeroa, lisätään se virhelistaan
    if(!req.body.numero) {
        errors.push("Numeroa ei määritetty")
    }
    // Jos listassa on virheitä, lähetetään käyttäjälle virheviesti ja jätetään
    // funktion suoritus kesken
    if(errors.length > 0){
        res.status(400).json({"error:": errors.join(",")})
        return
    }    

    var data = {
        //Poimitaan lähetetystä tiedosta kohta "numero"
        numero: req.body.numero
    }
    // SQL-käsky tietokannalle, lisätään poimittu tieto
    var insert = "INSERT INTO mittaus(numero, aika) VALUES (?, datetime(CURRENT_TIMESTAMP,\'localtime\'));"
    // Aiemmin postista poimittu numero asetetaan param-arvoon
    var param = [data.numero]
    //Lähetetään tietokantaan koodi ja numero
    db.run(insert, param, function(err, result) {
        if(err) {
            //Virhetilanteessa käyttäjälle info:
            res.status(400).json({"Error":err.message})
            //Konsoliin (="palvelimeen") tulostetaan virhetilanteessa:
            console.log("SQL error: %ERR%".replace("%ERR%", err.message))
            return
        }
        //Jos virhettä ei tapahdu niin:
        res.json({
            "message":"success",
            "data":data,
            "id":this.lastID

        })
        // "Palvelimelle" eli komentoriville vielä kuittaus lisätystä tiedosta
        console.log("Tietokantaan lisätty tietoa onnistuneesti")
    })
    
})

// Oletusvastaus, jos pyyntö ei onnistu
//app.use(function (req, res) {
  //  res.status(404);
//})