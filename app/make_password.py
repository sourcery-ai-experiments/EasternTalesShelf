from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from sqlalchemy.sql import insert
from werkzeug.security import generate_password_hash
from app.config import DATABASE_URI
# Database setup
# database url is taken from app.config
engine = create_engine(DATABASE_URI)
metadata = MetaData()

# Define users table structure, without binding the engine here
users = Table('users', metadata,
              Column('id', Integer, primary_key=True, autoincrement=True),
              Column('username', String(255), nullable=False),
              Column('password_hash', String(255), nullable=False)
             )

def create_admin_user(username, password):
    password_hash = generate_password_hash(password)
    # Connect to the database and insert the new user
    with engine.connect() as connection:
        # Begin a transaction
        with connection.begin():
            ins_query = insert(users).values(username=username, password_hash=password_hash)
            connection.execute(ins_query)
            print(f"Admin user {username} created successfully.")

if __name__ == "__main__":
    admin_username = input("Enter admin username: ")
    admin_password = input("Enter admin password: ")
    create_admin_user(admin_username, admin_password)