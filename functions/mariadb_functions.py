import api_keys
import mysql.connector
from datetime import datetime

def get_manga_list():
    try:
        # Establish a database connection
        host_name = api_keys.host_name
        db_name = api_keys.db_name
        user_name = api_keys.user_name
        db_password = api_keys.db_password

        # Define the global connection object
        connection = mysql.connector.connect(host = host_name,
                                                database = db_name,
                                                user = user_name,
                                                password = db_password)
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            # Execute the query to retrieve data
            cursor.execute("SELECT * FROM manga_list")
            # Fetch all the rows in a list of dictionaries
            manga_list = cursor.fetchall()

            # Helper function to handle None values and convert timestamps to datetime
            def parse_timestamp(timestamp):
                if timestamp is None:
                    # Assign an old date to None values
                    return datetime(1900, 1, 1)
                else:
                    # Assuming the timestamp is in the correct format, convert it to a datetime object
                    return timestamp  # Or use datetime.fromtimestamp(timestamp) if it's a Unix timestamp


            # Now let's sort the fetched data before returning it
            manga_list.sort(key=lambda x: parse_timestamp(x['last_updated_on_site']), reverse=True)

            return manga_list
    except Error as e:
        print("Error while connecting to MariaDB", e)
    finally:
        # Close the connection
        if connection.is_connected():
            cursor.close()
            connection.close()
    return []