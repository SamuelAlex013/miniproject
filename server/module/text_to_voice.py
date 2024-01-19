from flask import Response
from gtts import gTTS
import base64


def t2v(text, language_code='en-IN', accent='co.in'):
    try:
        tts = gTTS(text=text, lang=language_code, slow=False, tld=accent)
        with open('output.mp3', 'wb') as audio_file:
            tts.write_to_fp(audio_file)

        with open('output.mp3', 'rb') as audio_file:
            base64_audio = base64.b64encode(audio_file.read()).decode('utf-8')

        return {"audio": base64_audio}
    except Exception as e:
        return {'error': str(e)}
