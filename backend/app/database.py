import mysql.connector

from app.config.settings import (
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE
)


def get_connection():

    return mysql.connector.connect(

        host=MYSQL_HOST,

        user=MYSQL_USER,

        password=MYSQL_PASSWORD,

        database=MYSQL_DATABASE

    )