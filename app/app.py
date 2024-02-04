from functions import  mariadb_functions
from flask import Flask, render_template, current_app, jsonify
import json
from config import is_development_mode
import os
import requests

app = Flask(__name__)

@app.context_processor
def inject_debug():
    # Directly print out the FLASK_ENV variable
    print("FLASK_ENV: ", os.getenv('FLASK_ENV'))
    # printing in what mode the program is runned
    print("isDevelopment?: ", is_development_mode.DEBUG)
    return dict(isDevelopment=is_development_mode.DEBUG)


if is_development_mode.DEBUG:
    app.config['DEBUG'] = True  # Ensure this is only set for development
else:
    app.config['DEBUG'] = False

# Route for your home page
@app.route('/')
def home():
    # Fetch the 10 newest manga entries.
    # manga_entries = anilist_api_request.get_10_newest_entries('MANGA')
    manga_entries = mariadb_functions.get_manga_list(current_app.config)

    for entry in manga_entries:
        links = entry.get('external_links', '[]')  # Default to an empty JSON array as a string
        genres = entry.get('genres', '[]')
        # Check if links is a valid JSON array
        title_english = entry.get('title_english')
        title_romaji = entry.get('title_romaji')
       
        try:
            json.loads(links)
            json.loads(genres)
        except json.JSONDecodeError:
            entry['external_links'] = []  # Replace with an empty list or another suitable default
            entry['genres'] = []
        if title_english == "None":
            title_english = title_romaji
            entry['title_english'] = title_romaji  # Don't forget to update the entry dict as well


    # Pass the entries to the template.
    return render_template('index.html', manga_entries=manga_entries)


@app.route('/testing')
def test():

    # Fetch the 10 newest manga entries.
    # manga_entries = anilist_api_request.get_10_newest_entries('MANGA')
    manga_entries = mariadb_functions.get_manga_list(current_app.config,testing=True)

    for entry in manga_entries:
        links = entry.get('external_links', '[]')  # Default to an empty JSON array as a string
        genres = entry.get('genres', '[]')
        # Check if links is a valid JSON array
        try:
            json.loads(links)
            json.loads(genres)
        except json.JSONDecodeError:
            entry['external_links'] = []  # Replace with an empty list or another suitable default
            entry['genres'] = []
    # Pass the entries to the template.
    return render_template('new_vaules_alpha.html', manga_entries=manga_entries)
@app.route('/progress')
def progres():
    # Pass the entries to the template.
    return render_template('progressbar.html')
# Route for handling the log sync functionality
@app.route('/log_sync', methods=['POST'])
def log_sync():
    print('Sync successful')  # Print message to console
    return '', 204  # Return an empty response


@app.route('/sync', methods=['POST'])
def sync_with_fastapi():
    # Check if app is in development mode before proceeding
    if not app.config['DEBUG']:
        # If not in debug mode, return a custom message
        return jsonify({
            "status": "error",
            "message": "Nice try, but you can't do that"
        }), 403  # 403 Forbidden status code

    try:
        # Replace the URL with your actual FastAPI server address
        url = "http://10.147.17.146:8057/sync"
        response = requests.post(url)

        if response.status_code == 200:
            # Assuming the FastAPI response is JSON and includes a status
            return jsonify({
                "status": "success",
                "message": "Synced successfully with FastAPI",
                "fastapi_response": response.json()  # Include FastAPI response if needed
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": "Failed to sync with FastAPI"
            }), 500
    except requests.exceptions.RequestException as e:
        return jsonify({
            "status": "error",
            "message": "An error occurred while connecting to FastAPI: " + str(e)
        }), 500




if __name__ == '__main__':
    app.run(host='10.147.17.21', port=5000)




# Ensure this function is accessible in your templates

# THEN IN HTML: 
#<div class="score-icon" style="background-color: {{ score_to_color(entry.score) }}" title="Score: {{ entry.score }}">
  #      {{ entry.score }}
#  <div>

# def count_stats(counting_element):
#     """'counting_element' can be user status, entry detailes lile chapters volumes etc. ."""
#     user_completed = 0
#     user_planning = 0 
#     user_current = 0 
#     user_paused = 0 
#     manga_entries = mariadb_functions.get_manga_list(current_app.config)
#     for entry in manga_entries:
#         if entry.get('on_list_status') == "COMPLETED":
#             user_completed += 1
#         elif entry.get('on_list_status') == "PLANNING":
#             user_planning += 1
#         elif entry.get('on_list_status') == "CURRENT":
#             user_current += 1
#         elif entry.get('on_list_status') == "PAUSED":
#             user_paused += 1
#     return user_completed, user_planning, user_current, user_paused


# @app.context_processor
# def utility_processor():
#     return dict(count_stats=count_stats)