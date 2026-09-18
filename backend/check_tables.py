import sqlite3

conn = sqlite3.connect("deephire.db")

result = conn.execute(
    "SELECT name FROM sqlite_master WHERE type='table'"
).fetchall()

print(result)