from flask import Flask
from flask_cors import CORS
from blueprint.t2v_route import text_to_voice_bp
from blueprint.v2t_route import voice_to_text_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(text_to_voice_bp)
app.register_blueprint(voice_to_text_bp)

if __name__ == "__main__":
    app.run(debug=True)
