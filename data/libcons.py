import sqlite3
import json
def pretty_json(data):
    return json.dumps(data, ensure_ascii=False, indent=2)
conn = sqlite3.connect('userfetch.db') #change to user.db if you want to update database, used alt filename to prevent misoperation
cursor = conn.cursor()
cursor.execute("SELECT rowid, data FROM preset")
rows = cursor.fetchall()
for row in rows:
    rowid, data_column = row
    data_json = json.loads(data_column)
    if 'data' in data_json:
        data_node = data_json['data']
        for i in range(12, 8, -1):
            data_node[str(i+1)] = data_node.pop(str(i))
        data_node['9'] = "0"
    updated_data_column = pretty_json(data_json)
    cursor.execute("UPDATE preset SET data = ? WHERE rowid = ?", (updated_data_column, rowid))
conn.commit()
conn.close()
