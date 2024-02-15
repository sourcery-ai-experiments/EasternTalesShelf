import sqlite3

try:
    conn = sqlite3.connect('anilist_db.db')
    cursor = conn.cursor()
    cursor.execute("SELECT 1")
    record = cursor.fetchone()
    print("Connected to SQLite, server response:", record)
except sqlite3.Error as e:
    print(e)
