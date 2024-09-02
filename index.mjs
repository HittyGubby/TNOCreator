import { readdir } from 'fs';
import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(cors());

getfile('/flags');
getfile('/ideology');
getfile('/faction');

function getfile(path){
app.get(path, (req, res) => {
    readdir('.'+path, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        res.json(files);
    });
});    
}



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
