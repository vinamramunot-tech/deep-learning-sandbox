from src.models.voice_cloning.encoder.params_model import model_embedding_size as speaker_embedding_size
from src.models.voice_cloning.synthesizer.inference import Synthesizer
from src.models.voice_cloning.encoder import inference as encoder
from src.models.voice_cloning.vocoder import inference as vocoder
from pathlib import Path
import numpy as np
import soundfile as sf
import librosa
import os
from audioread.exceptions import NoBackendError

MODELS_PATH=f'{os.path.dirname(os.path.dirname(os.path.dirname(__file__)))}/src/models/voice_cloning'
OUTPUT_WAV_FOLDER='documentation/voice_cloning/demo_output_wavs'

enc_model_fpath = f'{MODELS_PATH}/encoder/saved_models/pretrained.pt'
syn_model_fpath = f'{MODELS_PATH}/synthesizer/saved_models/pretrained/pretrained.pt'
voc_model_fpath = f'{MODELS_PATH}/vocoder/saved_models/pretrained/pretrained.pt'

def voice_creation_build():

    if not os.path.exists(OUTPUT_WAV_FOLDER): os.makedirs(OUTPUT_WAV_FOLDER)
    
    ## Load the models one by one.
    print("Preparing the encoder, the synthesizer and the vocoder...")
    encoder.load_model(enc_model_fpath)
    synthesizer = Synthesizer(syn_model_fpath)
    vocoder.load_model(voc_model_fpath)
    
    
    texts_array = []
    with open('documentation/voice_cloning/sample_text.txt', 'r') as voice_cloning_para:
        texts_array = voice_cloning_para.readlines()
    
    if not texts_array:
        raise Exception("Input List is empty!")

    i = len(texts_array)

    counter = 0

    in_fpath = Path("documentation/voice_cloning/voice_cloning.wav")
    
    while counter < i:
        try:
            preprocessed_wav = encoder.preprocess_wav(in_fpath)
            original_wav, sampling_rate = librosa.load(str(in_fpath))
            preprocessed_wav = encoder.preprocess_wav(original_wav, sampling_rate)
            print("Loaded file succesfully")
            embed = encoder.embed_utterance(preprocessed_wav)
            print("Created the embedding")
            text = texts_array[counter]
            
            texts = [text]
            embeds = [embed]
            specs = synthesizer.synthesize_spectrograms(texts, embeds)
            spec = specs[0]
            print("Synthesizing the waveform:")
            
            generated_wav = vocoder.infer_waveform(spec)
            generated_wav = np.pad(generated_wav, (0, synthesizer.sample_rate), mode="constant")
            generated_wav = encoder.preprocess_wav(generated_wav)
            filename = f"{OUTPUT_WAV_FOLDER}/demo_output_{counter}.wav"
            print(generated_wav.dtype)
            sf.write(filename, generated_wav.astype(np.float32), synthesizer.sample_rate)
            print("\nSaved output as %s\n\n" % filename)
            
        except Exception as e:

            print("Caught exception: %s" % repr(e))
            print("Restarting\n")
        finally:
            counter = counter+1
