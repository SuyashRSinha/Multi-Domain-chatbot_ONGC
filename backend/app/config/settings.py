import os

MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")

MYSQL_PORT = int(os.getenv("MYSQL_PORT", "3306"))

MYSQL_USER = os.getenv("MYSQL_USER", "root")

MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "ss@29042009")

MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "chatbot_db")