from flask import Blueprint, jsonify, request, Response
from module.text_to_voice import t2v

text_to_voice_bp = Blueprint('text_to_voice', __name__)


@text_to_voice_bp.route('/text_to_voice', methods=['POST'])
def text_to_voice_route():
    try:
        data = request.get_json()
        text = data['text']
        language_code = data.get('language_code', 'en-IN')
        accent = data.get('accent', 'co.in')

        result = t2v(text, language_code, accent)

        if isinstance(result, Response):
            return result
        else:
            return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)})
