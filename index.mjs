import express, { json } from 'express';
//import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import crypto from 'crypto'
import cookieParser from 'cookie-parser'
import multer from 'multer';
import fs from 'fs'
const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const port = 5500;
app.use(express.json());
app.use(cookieParser());

const userdb = new sqlite3.Database('users.db');
userdb.run(`CREATE TABLE IF NOT EXISTS preset (id INTEGER,name TEXT,method TEXT,time TEXT,ip TEXT,user TEXT,ua TEXT,data TEXT,PRIMARY KEY("id"));`);
userdb.run(`CREATE TABLE IF NOT EXISTS auth (id INTEGER,user TEXT UNIQUE,pass TEXT,cookie TEXT,PRIMARY KEY("id"));`);
userdb.run(`CREATE TABLE IF NOT EXISTS upload (id INTEGER,type TEXT,filename TEXT,user TEXT,time TEXT,ip TEXT,ua TEXT,data BLOB,PRIMARY KEY("id"));`)

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
            db.get(`SELECT user FROM auth WHERE cookie = ?`, [cookie], (err, row) => {
              if (err) {return res.status(500).json({ success: false, message: 'Database error' });}
              if (!row) {return res.json({ success: false, message: 'Invalid session' });}
              const username = row.user;
              db.get(`SELECT user, data, name FROM preset WHERE user = ? AND method = 'save' ORDER BY id DESC LIMIT 1`, [username], (err, presetRow) => {
                if (err) {return res.status(500).json({ success: false, message: 'Database error' });}
                if (!presetRow) {return res.json({ success: true, user: username, message: 'No saved presets' });}
                res.json({ success: true, user: presetRow.user, data: presetRow.data, name: presetRow.name });});});});

function base64Decode(str) {return str=='' ? '':decodeURIComponent(escape(Buffer.from(str, 'base64').toString('binary')))}

app.get('/presets', (req, res) => {
    const db = new sqlite3.Database(`data/user.db`);
    const cookie = req.cookies.session;
    const usernameQuery = decodeURIComponent(req.query.username);
    db.get(`SELECT user FROM auth WHERE cookie = ?`, [cookie], (err, row) => {
        if (err) {return res.status(500).send('Error retrieving user');}
        if (!row) {return res.status(401).send('Unauthorized');}
        if (row.user !== usernameQuery) {return res.status(401).send('Unauthorized');}
        else {const user = row.user;
        db.all("SELECT id,name,data FROM preset WHERE user = ? AND method = 'save'", [user], (err, rows) => 
            {if (err) {return res.status(500).send('Error retrieving presets');}res.json(rows);});}});});

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

app.get(`/sfx/:name`, (req, res) => {
    const db = new sqlite3.Database(`data/data.db`);
    const name = req.params.name;
    db.get(`SELECT data FROM sfx WHERE name = ?`, [name], (err, row) => {
        if (err) {return res.status(500).send('Error retrieving');}
            if (row) {res.setHeader('Content-Type', 'audio/wav');res.send(row.data);} 
            else {res.status(404).send('SFX not found');}});});

setupDatabaseRoutes(['flag','portrait','focus','econ','econsub','faction','ideology','header','super','news']);
function setupDatabaseRoutes(dbs) {
    dbs.forEach(dbname => {
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
                else {res.status(404).send('Image not found');}});});});
}

function setupDatabaseRoutesUser(dbs) {
    const udb = new sqlite3.Database(`data/user.db`);
    const db = new sqlite3.Database(`data/upload.db`);
    dbs.forEach(dbname => {
      app.get(`/api/user/${dbname}`, (req, res) => {
        const cookie = req.cookies.session;
        const query = req.query.q || '';
        const includeShared = req.headers['queryshared'] === 'true';
        if (cookie === undefined) {
            if (includeShared) {
                db.all(`SELECT filename, user FROM ${dbname} WHERE filename LIKE ? AND shared = 'true'`, [`%${query}%`], (err, rows) => {
                    if (err) {return res.status(500).send('Error retrieving images');}res.json(rows);});} else {res.json([]);}
        } else {
            udb.get(`SELECT user FROM auth WHERE cookie = ?`, [cookie], (err, row) => {
                if (err) {return res.status(500).send('Error retrieving user');}
                if (!row) {return res.status(401).send('Unauthorized');}
                const user = row.user;
                if (includeShared) {
                    db.all(`SELECT filename, user FROM ${dbname} WHERE filename LIKE ? AND ((user = ? AND shared = 'false') OR shared = 'true')`,
                        [`%${query}%`, user],
                        (err, rows) => {if (err) {return res.status(500).send('Error retrieving images');}res.json(rows);});
                } else {
                    db.all(`SELECT filename, user FROM ${dbname} WHERE filename LIKE ? AND user = ?`,[`%${query}%`, user],
                        (err, rows) => {if (err) {return res.status(500).send('Error retrieving images');}res.json(rows);});}});}});
    


                  app.get(`/api/user/${dbname}/:name`, (req, res) => {
                    const cookie = req.cookies.session;
                    const name = req.params.name;
                    const folderPath = path.join(path.resolve(), 'data/upload', dbname);
                    if (!fs.existsSync(folderPath)) {fs.mkdirSync(folderPath, { recursive: true })}
                    if (cookie === undefined) {
                      db.get(`SELECT shared FROM ${dbname} WHERE filename = ? AND shared = 'true'`, [name], (err, row) => {
                        if (err) return res.status(500).send('Error retrieving metadata');
                        if (row) {
                          const filePath = path.join(folderPath, name);
                          if (fs.existsSync(filePath)) {
                            res.setHeader('Content-Type', 'image/png');
                            return res.sendFile(filePath);}
                          return res.status(404).send('Image file not found');}
                        res.status(404).send('Image not found');});
                    } else {
                      udb.get(`SELECT user FROM auth WHERE cookie = ?`, [cookie], (err, row) => {
                        if (err) return res.status(500).send('Error retrieving user');
                        if (!row) return res.status(401).send('Unauthorized');
                        const user = row.user;
                        db.get(
                          `SELECT shared FROM ${dbname} WHERE filename = ? AND ((user = ? AND shared = 'false') OR shared = 'true')`,
                          [name, user],
                          (err, row) => {
                            if (err) return res.status(500).send('Error retrieving metadata');
                            if (row) {
                              const filePath = path.join(folderPath, name);
                              if (fs.existsSync(filePath)) {
                                res.setHeader('Content-Type', 'image/png');
                                return res.sendFile(filePath);}
                              return res.status(404).send('Image file not found');}
                            res.status(404).send('Image not found');});});}});
});}
setupDatabaseRoutesUser(['flag', 'portrait', 'focus', 'econ', 'econsub', 'faction', 'ideology', 'header', 'super', 'news']);


app.post('/upload', upload.array('files'), (req, res) => {
  const udb = new sqlite3.Database(`data/user.db`);
  const db = new sqlite3.Database(`data/upload.db`);
  const d = new Date();
  const files = req.files;
  const cookie = req.cookies.session;
  udb.get(`SELECT user FROM auth WHERE cookie = ?`, [cookie], (err, row) => {
    if (err) return res.status(500).send('Error retrieving user');
    if (!row) return res.status(401).send('Unauthorized');
    if (row.user !== base64Decode(req.body.username)) {return res.status(401).send('Unauthorized');}
    const username = base64Decode(req.body.username);
    const tableType = req.headers['type'];
    const shared = req.headers['shared'];
    const folderPath = path.join(path.resolve(), 'data/upload', tableType);
    if (!fs.existsSync(folderPath)) {fs.mkdirSync(folderPath, { recursive: true });}
    let completed = 0;
    const errors = [];
    const insertMetadata = (file, callback) => {
      db.run(`INSERT OR IGNORE INTO ${tableType} (filename, time, ip, user, ua, shared) VALUES (?, ?, ?, ?, ?, ?)`,
        [file.originalname,d.toLocaleString('zh-CN'),req.ip,username,req.headers['user-agent'],shared,],callback);};
    files.forEach((file) => {
      const filePath = path.join(folderPath, file.originalname);
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
          errors.push(`Error saving file: ${file.originalname} - ${err.message}`);
          completed++;
          if (completed === files.length) {
            return res.status(500).json({ error: errors });}} else {
          insertMetadata(file, (err) => {
            if (err) {errors.push(`Error inserting metadata: ${file.originalname} - ${err.message}`);}
            completed++;
            if (completed === files.length) {
              if (errors.length > 0) {
                res.status(500).json({ error: errors });} else 
                {res.status(200).json({ message: 'Files uploaded successfully' });}}});}});});});});

app.post('/assetdel', (req, res) => {
  const db = new sqlite3.Database(`data/upload.db`);
  const udb = new sqlite3.Database(`data/user.db`);
  const cookie = req.cookies.session;
  const { filename, type } = req.body;
  udb.get(`SELECT user FROM auth WHERE cookie = ?`, [cookie], (err, row) => {
    if (err) {return res.status(500).send('Error retrieving user'+err);}
    if (!row) {return res.status(401).send('Unauthorized');}
    const user = row.user;
    db.run(`UPDATE ${type} SET shared = 'deleted' WHERE filename = ? AND user = ?`, [filename, user], (err) => {
      if (err) {return res.status(500).send('Error deleting asset'+err);}
      res.json({ success: true, message: 'Asset deleted successfully' });});});});
                
//this line must be on top of express.static or otherwise maybe compromising databases
app.get('/data/:name',(req,res) => { const name = req.params.name; res.status(403).send(`${name} : File Access Restricted`);});
//app.use(cors());  //uncomment to allow cross origin reqs (separating api and frontend)
app.use(express.static(path.resolve()));
app.listen(port, () => {console.log(`Server running at http://localhost:${port}`);});