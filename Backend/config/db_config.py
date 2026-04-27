DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'test'
}

def get_db():
    import mysql.connector 
    return mysql.connector.connect(**DB_CONFIG)