import os
import time
import mysql.connector
from app.config.settings import (
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE
)

def init_db():
    print("Initializing database...")
    retries = 10
    conn = None
    while retries > 0:
        try:
            conn = mysql.connector.connect(
                host=MYSQL_HOST,
                port=MYSQL_PORT,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD
            )
            break
        except Exception as e:
            retries -= 1
            print(f"Waiting for database connection... ({retries} retries left). Error: {e}")
            if retries == 0:
                print("Failed to connect to database. Exiting initialization.")
                return
            time.sleep(3)

    try:
        cursor = conn.cursor()
        
        # Create database if not exists
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DATABASE}")
        cursor.execute(f"USE {MYSQL_DATABASE}")
        
        # Read and run schema.sql
        schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
        if os.path.exists(schema_path):
            with open(schema_path, "r") as f:
                schema_sql = f.read()
            
            # Split commands by semicolon and execute them
            # We filter out empty lines or comments
            commands = schema_sql.split(";")
            for command in commands:
                cleaned_cmd = command.strip()
                # Skip comments and empty commands
                if cleaned_cmd and not cleaned_cmd.startswith("--"):
                    cursor.execute(cleaned_cmd)
            
            conn.commit()
            print("Database initialized successfully.")
        else:
            print(f"Schema file not found at {schema_path}")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error initializing database: {e}")
