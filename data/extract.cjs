const sqlite3 = require('sqlite3').verbose();
const fs = require('fs-extra');
const path = require('path');

async function extractPicturesFromDB(dbPath, uploadFolder) {
    const db = new sqlite3.Database(dbPath);
    db.all("SELECT name FROM sqlite_master WHERE type='table';", async (err, tables) => {
        if (err) {
            console.error(err);
            return;
        }

        for (const table of tables) {
            const tableName = table.name;
            const tableFolder = path.join(uploadFolder, tableName);
            await fs.ensureDir(tableFolder);
            db.each(`SELECT filename, data FROM ${tableName};`, async (err, row) => {
                if (err) {
                    console.error(err);
                    return;
                }
                const { filename, data } = row;
                if (data) {
                    const filePath = path.join(tableFolder, filename);
                    await fs.writeFile(filePath, Buffer.from(data, 'latin1'));
                    db.run(`UPDATE ${tableName} SET data=NULL WHERE filename=?`, [filename], (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            });
        }
        db.exec("VACUUM;", (err) => {
            if (err) {
                console.error(err);
            }
            db.close();
        });
    });
}
const dbPath = 'upload.db';
const uploadFolder = 'upload';
extractPicturesFromDB(dbPath, uploadFolder);
