import speech_recognition as sr


def v2t(audio_data, language='en-IN'):
    recognizer = sr.Recognizer()

    try:
        # Use the recognizer to convert audio data to text with the specified language
        text = recognizer.recognize_google(audio_data, language=language)
        result = {'text': text}
    except sr.UnknownValueError:
        result = {'error': 'Could not understand audio.'}
    except sr.RequestError as e:
        result = {'error': f"Could not request results from Google Speech Recognition service; {e}"}

    return result
