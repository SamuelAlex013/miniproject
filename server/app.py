# app.py
from flask import Flask
from blueprint.v2t_route import voice_to_text_bp

app = Flask(__name__)
app.register_blueprint(voice_to_text_bp)

if __name__ == "__main__":
    app.run(debug=True)
