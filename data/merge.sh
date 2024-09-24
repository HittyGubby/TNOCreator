#!/bin/bash
merged_db="image.db"
sqlite3 $merged_db "VACUUM;"
for db in *.db; do
  table_name=$(basename "$db" .db)
 sqlite3 $merged_db <<EOF
ATTACH DATABASE '$db' AS to_merge;
CREATE TABLE $table_name AS SELECT * FROM to_merge.images;
DETACH DATABASE to_merge;
EOF

done
echo "done"
