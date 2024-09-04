import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
const app = express();
const port = 5500;

//app.use(cors());  //uncomment to allow cross origin reqs (separating api and fronted)
app.use(express.static(path.resolve()));

setupDatabaseRoutes('flag');
setupDatabaseRoutes('portrait');
setupDatabaseRoutes('focus');
setupDatabaseRoutes('econ');
setupDatabaseRoutes('econsub');
setupDatabaseRoutes('faction');
setupDatabaseRoutes('ideology');

function setupDatabaseRoutes(dbname) {
    const db = new sqlite3.Database(`data/${dbname}.db`);

    app.get(`/api/${dbname}`, (req, res) => {
        const query = req.query.q || '';
        db.all(`SELECT name FROM images WHERE name LIKE ?`, [`%${query}%`], (err, rows) => {
            if (err) {return res.status(500).send('Error retrieving images');}
            res.json(rows);});});
    app.get(`/api/${dbname}/:name`, (req, res) => {
        const name = req.params.name;
        db.get("SELECT data FROM images WHERE name = ?", [name], (err, row) => {
            if (err) {
                return res.status(500).send('Error retrieving image');}
                if (row) {
                    res.setHeader('Content-Type', 'image/png');
                    res.send(row.data);
                } 
                else {res.status(404).send('Image not found');}});});
}

//flag, focus, newsimage and portrait using db query 
//faction, ideology, econ type and subtype using dropdown list with direct local file

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
