from flask import Blueprint, jsonify, request
from voice_to_text import v2t
import base64

voice_to_text_bp = Blueprint('voice_to_text', __name__)


@voice_to_text_bp.route('/voice_to_text', methods=['POST'])
def voice_to_text():
    """ter
    JSON Input:
    {
        "audio": "base64-encoded-audio-string",
        "language": "en-IN"   Optional, defaults to "en-IN"
    }

    Output:
    {
        "text": "recognized-text"
         or
        "error": "error-message"
    }
    """
    try:
        data = request.get_json()
        audio_data_base64 = data['audio']
        language = data.get('language', 'en-IN')
        audio_data_binary = base64.b64decode(audio_data_base64)
        result = v2t(audio_data_binary, language)

        return jsonify(result)
    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        return jsonify({'error': error_message})
