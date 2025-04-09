import mysql.connector
import os

def seed_database():
    try:
        # Connect to MySQL server (without selecting a database)
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password=""
        )
        
        cursor = connection.cursor()
        
        # Create database if it doesn't exist
        cursor.execute("CREATE DATABASE IF NOT EXISTS movie_booking")
        cursor.execute("USE movie_booking")
        
        # Create movies table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                duration INT,
                release_date DATE,
                genre VARCHAR(100),
                rating FLOAT,
                image_url TEXT,
                price DECIMAL(10, 2) DEFAULT 300.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Get the directory of this script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Read and execute the SQL file
        with open(os.path.join(script_dir, 'seed_movies.sql'), 'r', encoding='utf-8') as file:
            sql_commands = file.read()
            # Split commands and execute each one
            for command in sql_commands.split(';'):
                if command.strip():
                    try:
                        cursor.execute(command)
                        print(f"Executed command successfully")
                    except mysql.connector.Error as err:
                        print(f"Error executing command: {err}")
                        print(f"Command was: {command}")

        # Commit the changes
        connection.commit()
        print("Successfully added movies to the database!")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print("Database connection closed.")

if __name__ == "__main__":
    seed_database() 