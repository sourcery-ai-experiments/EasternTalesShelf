import json
import time
import requests
import mysql.connector
from db_config import conn
from tqdm import tqdm
from datetime import datetime
import api_keys
# ANSI escape sequences for colors
RESET = "\033[0m"
RED = "\033[31m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
BLUE = "\033[34m"
MAGENTA = "\033[35m"
CYAN = "\033[36m"
WHITE = "\033[37m"




def update_favorites_fn(user_id = None):
    """
    Updates the favorite manga list in the database for a given user.

    This function retrieves the user's favorite manga list from AniList API and updates the database
    with any new favorites. It uses the AniList GraphQL API to fetch the manga data and compares it
    with the existing favorites in the database to identify any new additions.

    Returns:
        None
    """
    has_next_page = True
    url = 'https://graphql.anilist.co'

    user_id = api_keys.anilist_id

    try:
        fav_page = 0
        
        connection = conn
        cursor = connection.cursor()

        # Fetch already favorite manga IDs to optimize updates
        cursor.execute(f"SELECT id_anilist FROM {api_keys.table_name} WHERE is_favourite = 1")
        already_favorites = {row[0] for row in cursor.fetchall()}

        while has_next_page:
            variables_in_api = {'page': fav_page, 'id': user_id}
            api_request = '''
            query ($page: Int, $id: Int) {
                User(id: $id) {
                    id
                    name
                    favourites {
                        manga(page: $page) {
                            pageInfo {
                                total
                                perPage
                                currentPage
                                lastPage
                                hasNextPage
                            }
                            nodes {
                                id
                                title {
                                    english
                                }
                            }
                        }
                    }
                }
            }
            '''
            response_from_anilist = requests.post(url, json={'query': api_request, 'variables': variables_in_api})
            parsed_json = json.loads(response_from_anilist.text)

            ids_to_update = [fav_manga["id"] for fav_manga in parsed_json["data"]["User"]["favourites"]["manga"]["nodes"] if fav_manga["id"] not in already_favorites]
            print(f"{BLUE}Checking page...{RESET}") 
            print(f"{CYAN}Page {fav_page}{RESET}")
            # If there are new favorites to update
            if not ids_to_update:
                print(f"{YELLOW}No new favorites found{RESET}")
            if ids_to_update:
                update_query = f"UPDATE {api_keys.table_name} SET is_favourite = 1 WHERE id_anilist = %s"
                try:
                    # Execute updates in a batch
                    for fav_manga_id in ids_to_update:
                        cursor.execute(update_query, (fav_manga_id,))
                    # Commit all changes at once
                    connection.commit()
                    print(f"{GREEN}Updated {len(ids_to_update)} mangas to favorite{RESET}")
                except mysql.connector.Error as err:
                    print(f"{RED}Failed to batch update mangas: {err}{RESET}")

            has_next_page = parsed_json["data"]["User"]["favourites"]["manga"]["pageInfo"]["hasNextPage"]
            fav_page += 1
    except mysql.connector.Error as e: #if cannot connect to database
        print("Error reading data from MySQL table", e)
    finally: # close connection after completing program
        if connection.is_connected():
            connection.close()
            cursor.close()
            print("MySQL connection is closed")

if __name__ == "__main__":
    update_favorites_fn()

