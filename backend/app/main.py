import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
# Note: The imports will be from the 'app' package now.
from .scraper import get_daily_holiday
from .content_generator import generate_content

# The static folder is now relative to the new frontend build directory
app = Flask(__name__, static_folder='../../../frontend/build')
CORS(app)

# In-memory data
LANGUAGES = ["English", "French", "Breton", "Italian", "Spanish", "Portuguese", "German", "Russian", "Tatar", "Bashkir", "Chuvash", "Armenian", "Georgian", "Greek"]
LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"]
SPEAKING_CLUBS = [
    {"id": 1, "name": "Keeping Up With Science", "source": "sciencedaily.com"},
    {"id": 2, "name": "Let's Celebrate: Science Edition", "source": "todayinsci.com"},
    {"id": 3, "name": "Let's Celebrate", "source": "nationaltoday.com"},
    {"id": 4, "name": "The Greatest Quotes", "source": "brainyquote.com, quotationspage.com"}
]

@app.route('/api/languages', methods=['GET'])
def get_languages():
    return jsonify(LANGUAGES)

@app.route('/api/levels', methods=['GET'])
def get_levels():
    return jsonify(LEVELS)

@app.route('/api/speaking_clubs', methods=['GET'])
def get_speaking_clubs():
    return jsonify(SPEAKING_CLUBS)

@app.route('/api/speaking_clubs/3/content', methods=['GET'])
def get_lets_celebrate_content():
    try:
        holiday_name, holiday_url, article_text = get_daily_holiday()
        if article_text:
            content = generate_content(article_text)
            return jsonify({
                "name": holiday_name,
                "url": holiday_url,
                "vocabulary": content["vocabulary"],
                "round_one": content["round_one"],
                "round_two": content["round_two"]
            })
        else:
            return jsonify({"error": "Could not retrieve holiday content"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # The path to the static folder is now different
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Using port 5002 to avoid conflicts with the React dev server
    app.run(debug=True, port=5002)
