from ..models.voice_cloning.synthesizer.inference import Synthesizer
from ..models.voice_cloning.encoder import inference as encoder
from ..models.voice_cloning.vocoder import inference as vocoder
import numpy as np
import soundfile as sf
import librosa
import os
import base64

VOICE_CLONING_UPLOAD_FOLDER = 'voice_cloning_uploads'

encoder_path = f'{os.path.dirname(os.path.dirname(__file__))}/models/voice_cloning/encoder/saved_models/pretrained.pt'
syn_model_path = f'{os.path.dirname(os.path.dirname(__file__))}/models/voice_cloning/synthesizer/saved_models/pretrained/pretrained.pt'
voc_model_fpath = f'{os.path.dirname(os.path.dirname(__file__))}/models/voice_cloning/vocoder/saved_models/pretrained/pretrained.pt'

def voice_cloning(audioFilePath, text):
    encoder.load_model(encoder_path)
    synthesizer = Synthesizer(syn_model_path)
    vocoder.load_model(voc_model_fpath)

    try:
        original_wav, sampling_rate = librosa.load(audioFilePath)
        preprocessed_wav = encoder.preprocess_wav(original_wav, sampling_rate)
        embed = encoder.embed_utterance(preprocessed_wav)

        spec = synthesizer.synthesize_spectrograms([text], [embed])[0]
        generated_wav = vocoder.infer_waveform(spec)
        generated_wav = encoder.preprocess_wav(generated_wav)

        starting_position = audioFilePath.rfind('/')
        end_position = audioFilePath.rfind('.wav')
        output_file_path = f'{os.path.dirname(os.path.dirname(__file__))}/{VOICE_CLONING_UPLOAD_FOLDER}/{audioFilePath[starting_position:end_position]}_output.wav'

        sf.write(output_file_path, generated_wav.astype(np.float32), synthesizer.sample_rate)

        outputFileBase64 = base64.b64encode(open(output_file_path, "rb").read())

        return {'output': outputFileBase64.decode('utf-8')}
        
    except Exception as e:
        raise e
    finally:
        if os.path.exists(output_file_path):
            os.remove(output_file_path)
