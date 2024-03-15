import speech_recognition as sr


def v2t(audio_data, language='en-IN', output_wav_file='output.wav'):
    recognizer = sr.Recognizer()

    try:
        with open(output_wav_file, 'wb') as wav_file:
            wav_file.write(audio_data)

        # Recognize text from the saved WAV file
        with sr.AudioFile(output_wav_file) as audio_file:
            audio_data = recognizer.record(audio_file)
            text = recognizer.recognize_google(audio_data, language=language)
            result = {'text': text}

    except sr.UnknownValueError:
        result = {'error': 'Could not understand audio.'}
    except sr.RequestError as e:
        result = {'error': f"Could not request results from Google Speech Recognition service; {e}"}

    return result
