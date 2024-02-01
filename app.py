from functions import anilist_api_request, mariadb_functions
from flask import Flask, render_template, request, jsonify
import json
app = Flask(__name__)



 # EZXAMPLE HOW TO USE FUNCTION OF PYTHON IN HTML
# def score_to_color(score):
#     if score >= 8:
#         return '#4CAF50'  # Green for high scores
#     elif score >= 5:
#         return '#FFC107'  # Yellow for medium scores
#     else:
#         return '#F44336'  # Red for low scores

# # Ensure this function is accessible in your templates
# @app.context_processor
# def utility_processor():
#     return dict(score_to_color=score_to_color)

# THEN IN HTML: 
#<div class="score-icon" style="background-color: {{ score_to_color(entry.score) }}" title="Score: {{ entry.score }}">
  #      {{ entry.score }}
#  <div>



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
    manga_entries = mariadb_functions.get_manga_list(testing=True)

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

if __name__ == '__main__':
    app.run(host='10.147.17.21', port=5000, debug=True)
