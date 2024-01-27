from functions import anilist_api_request, mariadb_functions
from flask import Flask, render_template, request, jsonify
import json
app = Flask(__name__)

# Route for your home page
@app.route('/')
def home():
    # Fetch the 10 newest manga entries.
    # manga_entries = anilist_api_request.get_10_newest_entries('MANGA')
    manga_entries = mariadb_functions.get_manga_list()

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
    return render_template('index.html', manga_entries=manga_entries)



# Route for handling the log sync functionality
@app.route('/log_sync', methods=['POST'])
def log_sync():
    print('Sync successful')  # Print message to console
    return '', 204  # Return an empty response

if __name__ == '__main__':
    app.run(host='10.147.17.21', port=5000, debug=True)
