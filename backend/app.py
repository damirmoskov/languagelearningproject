from flask import Flask, jsonify
from flask_cors import CORS

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

if __name__ == '__main__':
    app.run(debug=True, port=5001)
