// Otetaan sqlite3 tietokantaohjelma käyttöön
var sqlite3 = require("sqlite3").verbose()

// Vakio, missä meidän tietokanta on ja tietokantatiedoston nimi
const DBSOURCE = "mittaukset.db3"

//
let db = new sqlite3.Database(DBSOURCE, (err) =>{
    //Jos erroria tulee
    if(err) {
        //Konsoliin viestinä errori, mikä tuli
        console.error(err.message)
        throw err
    } else {
        //Jos kytkentä onnistuu, konsoliin viesti:
        console.log("Tietokantaan kytkeytyminen onnistui")
        //Sitten tietokantatekstiä; luodaan taulukko mittauksile
        db.run("CREATE TABLE mittaus (\
            id INTEGER PRIMARY KEY AUTOINCREMENT, \
            numero TEXT, \
            aika TEXT);", (err) =>{
                if(err) {

                    //
                } else {
                    var insert = "INSERT INTO mittaus(numero, aika) VALUES (?, datetime(CURRENT_TIMESTAMP,\'localtime\'));"
                    db.run(insert, [20011])
                    db.run(insert, [20012])
                }
            })
    }
})

module.exports = db