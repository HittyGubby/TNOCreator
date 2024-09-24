import express, { json } from 'express';
//import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import crypto from 'crypto'
import cookieParser from 'cookie-parser'
const app = express();
const port = 5500;
app.use(express.json());
app.use(cookieParser());

const userdb = new sqlite3.Database('users.db');
userdb.run(`CREATE TABLE IF NOT EXISTS "preset" (
	"id"	INTEGER,
	"name"	TEXT,
	"method"	TEXT,
	"time"	TEXT,
	"ip"	TEXT,
	"user"	TEXT,
	"ua"	TEXT,
	"data"	TEXT,
	PRIMARY KEY("id")
);`);
userdb.run(`CREATE TABLE IF NOT EXISTS "auth" (
	"id"	INTEGER,
	"user"	TEXT UNIQUE,
	"pass"	TEXT,
	"cookie"	TEXT,
	PRIMARY KEY("id")
);`);

app.post('/login', (req, res) => {
    const db = new sqlite3.Database(`data/user.db`);
    const { user, pass } = req.body;
    db.get(`SELECT * FROM auth WHERE user = ?`, [user], (err, row) => {
        if (err) {return res.status(500).json({ success: false, message: 'Database error' });}
        if (!row) {return res.json({ success: false, message: 'User not found' });}
        if (row.pass !== pass) {return res.json({ success: false, message: 'Invalid credentials' });}
        const cookie = crypto.randomBytes(16).toString('hex');
        db.run(`UPDATE auth SET cookie = ? WHERE user = ?`, [cookie, user], (err) => {
            if (err) {return res.status(500).json({ success: false, message: 'Database error' });}
            res.json({ success: true, cookie });});});});

app.post('/register', (req, res) => {
    const db = new sqlite3.Database(`data/user.db`);
    const { user, pass } = req.body;
    if(user!=''){const cookie = crypto.randomBytes(16).toString('hex');
    db.run(`INSERT INTO auth (user, pass, cookie) VALUES (?, ?, ?)`, [user, pass, cookie], function(err) {
        if (err) {if (err.code === 'SQLITE_CONSTRAINT') {return res.json({ success: false, message: 'Username already exists' });}
            return res.status(500).json({ success: false, message: 'Database error' });}
        res.json({ success: true, cookie });});}});

app.get('/auto-login', (req, res) => {
    const cookie = req.cookies.session;
    const db = new sqlite3.Database(`data/user.db`);
    db.get(`SELECT user FROM auth WHERE cookie = ?`, [cookie], (err, row) => {if (err) 
        {return res.status(500).json({ success: false, message: 'Database error' });}
        if (!row) {return res.json({ success: false, message: 'Invalid session' });}
        res.json({ success: true, username: row.user });});});

function base64Decode(str) {return decodeURIComponent(escape(Buffer.from(str, 'base64').toString('binary')));}

app.get('/presets', (req, res) => {
    const db = new sqlite3.Database(`data/user.db`);
    const cookie = req.cookies.session;
    db.get(`SELECT user FROM auth WHERE cookie = ?`, [cookie], (err, row) => {
        if (err) {return res.status(500).send('Error retrieving user');}
        if (!row) {return res.status(401).send('Unauthorized');}
        const user = row.user;
        db.all("SELECT * FROM preset WHERE user = ? AND method = 'save'", [user], (err, rows) => {
            if (err) {return res.status(500).send('Error retrieving presets');}res.json(rows);});});});

app.post('/preset', (req, res) => {
    const db = new sqlite3.Database(`data/user.db`);
    const d = new Date();
    db.run("INSERT INTO preset (name,method,time,ip,user,ua,data) VALUES (?,?,?,?,?,?,?)", [base64Decode(req.headers['name']),req.headers['method'],d.toLocaleString("zh-CN"),req.ip,base64Decode(req.headers['username']),req.headers['user-agent'],JSON.stringify(req.body, null, 2)]);
    res.sendStatus(200);});

app.get('/presetsdel', (req, res) => {
        const db = new sqlite3.Database(`data/user.db`);
        const cookie = req.cookies.session;
        db.get(`SELECT user FROM auth WHERE cookie = ?`, [cookie], (err, row) => {
            if (err) {return res.status(500).send('Error retrieving user');}
            if (!row) {return res.status(401).send('Unauthorized');}
            const user = row.user;
            db.run("UPDATE preset SET method = 'deleted' WHERE id = ? AND user = ?", [req.headers['id'], user], (err) => {
                if (err) {return res.status(500).send('Error deleting preset');}res.send('ok');});});});

//this line must be on top of express.static or otherwise maybe compromising databases
app.get('/data/:name',(req,res) => { const name = req.params.name; res.status(403).send(`${name} : File Access Restricted`);});
//app.use(cors());  //uncomment to allow cross origin reqs (separating api and frontend)

app.get(`/sfx/:name`, (req, res) => {
    const db = new sqlite3.Database(`data/data.db`);
    const name = req.params.name;
    db.get(`SELECT data FROM sfx WHERE name = ?`, [name], (err, row) => {
        if (err) {return res.status(500).send('Error retrieving');}
            if (row) {res.setHeader('Content-Type', 'audio/wav');res.send(row.data);} 
            else {res.status(404).send('SFX not found');}});});

setupDatabaseRoutes('flag');
setupDatabaseRoutes('portrait');
setupDatabaseRoutes('focus');
setupDatabaseRoutes('econ');
setupDatabaseRoutes('econsub');
setupDatabaseRoutes('faction');
setupDatabaseRoutes('ideology');
setupDatabaseRoutes('header');
setupDatabaseRoutes('super');
setupDatabaseRoutes('news');

function setupDatabaseRoutes(dbname) {
    const db = new sqlite3.Database(`data/data.db`);
    app.get(`/api/${dbname}`, (req, res) => {
        const query = req.query.q || '';
        db.all(`SELECT name FROM ${dbname} WHERE name LIKE ?`, [`%${query}%`], (err, rows) => {
            if (err) {return res.status(500).send('Error retrieving images');}res.json(rows);});});
    app.get(`/api/${dbname}/:name`, (req, res) => {
        const name = req.params.name;
        db.get(`SELECT data FROM ${dbname} WHERE name = ?`, [name], (err, row) => {
            if (err) {return res.status(500).send('Error retrieving image');}
                if (row) {res.setHeader('Content-Type', 'image/png');res.send(row.data);} 
                else {res.status(404).send('Image not found');}});});}

app.use(express.static(path.resolve()));

app.listen(port, () => {console.log(`Server running at http://localhost:${port}`);});