from flask import Flask, jsonify
from flask_cors import CORS

try:
    from scraper import scrape_national_today
    from content_generator import generate_vocabulary, generate_questions
except ImportError:
    def scrape_national_today():
        return {"error": "Scraper module not found."}
    def generate_vocabulary(text):
        return []
    def generate_questions(text):
        return {"round_one": [], "round_two": []}


app = Flask(__name__)
CORS(app)

languages = [
    "English", "French", "Breton", "Italian", "Spanish", "Portuguese",
    "German", "Russian", "Tatar", "Bachkir", "Chuvash", "Armenian",
    "Georgian", "Greek"
]

levels = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"]

speaking_clubs = [
    {
        "id": 1,
        "name": "Keeping Up With Science",
        "source": "sciencedaily.com"
    },
    {
        "id": 2,
        "name": "Let's celebrate. Science Edition",
        "source": "todayinsci.com"
    },
    {
        "id": 3,
        "name": "Let's celebrate",
        "source": "nationaltoday.com"
    },
    {
        "id": 4,
        "name": "The Greatest Quotes",
        "source": "brainyquote.com, quotationspage.com"
    }
]

@app.route('/api/languages')
def get_languages():
    return jsonify(languages)

@app.route('/api/levels')
def get_levels():
    return jsonify(levels)

@app.route('/api/speaking_clubs')
def get_speaking_clubs():
    return jsonify(speaking_clubs)

@app.route('/api/speaking_clubs/3/content')
def get_lets_celebrate_content():
    scraped_data = scrape_national_today()

    if scraped_data.get("error"):
        return jsonify(scraped_data), 500

    content = scraped_data.get("content", "")

    vocabulary = generate_vocabulary(content)
    questions = generate_questions(content)

    response_data = {
        "name": scraped_data.get("name"),
        "url": scraped_data.get("url"),
        "vocabulary": vocabulary,
        "round_one": questions.get("round_one"),
        "round_two": questions.get("round_two")
    }

    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
