import sqlite3
import os

def insert_image(cursor, filename, data):
    cursor.execute("INSERT INTO sfx (name, data) VALUES (?, ?)", (filename, data))

def main():
    db = sqlite3.connect('data.db')
    cursor = db.cursor()

    folder_path = '.'
    for filename in os.listdir(folder_path):
        if filename.endswith('.wav'):
            with open(os.path.join(folder_path, filename), 'rb') as file:
                data = file.read()
                insert_image(cursor, filename, data)

    db.commit()
    db.close()

if __name__ == '__main__':
    main()
