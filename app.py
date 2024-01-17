from functions import anilist_api_request
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')

def home():
    # Fetch the 10 newest manga entries.
    manga_entries = anilist_api_request.get_10_newest_entries('MANGA')

    # Pass the entries to the template.
    return render_template('index.html', manga_entries=manga_entries)

if __name__ == '__main__':
    app.run(debug=True)
