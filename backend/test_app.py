import pytest
from flask import Flask, jsonify

def create_test_app():
    app = Flask(__name__)

    languages = [
        "English", "French", "Breton", "Italian", "Spanish", "Portuguese",
        "German", "Russian", "Tatar", "Bachkir", "Chuvash", "Armenian",
        "Georgian", "Greek"
    ]

    @app.route('/api/languages')
    def get_languages():
        return jsonify(languages)

    return app

@pytest.fixture
def client():
    app = create_test_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_languages(client):
    """Test the /api/languages endpoint."""
    response = client.get('/api/languages')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert "English" in data
