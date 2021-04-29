# Generalization Process for Voice Cloning for Deep Fake

## Voice Creation Feature from our web app Voice Cloning

To create generalization audio clips for other people please follow the steps below:

1. Enter the text in the `documentation/voice_cloning/sample_text.txt`. Each line should only contain 4-5 phrases for good quality output.
2. Copy the audio file that you want to use and paste it inside `documentation/voice_cloning/` and rename it as `voice_cloning.wav`
3. Run `python3 build_voice_cloning.py` or `python build_voice_cloning.py`
4. Once you have all the individual audio files upload it to https://clideo.com/merge-wav to merge the audio files into one audio file.

---

## Voice Creation Feature from [Vo.codes](https://vo.codes)

1. Go to [Vo.codes](https://vo.codes)
2. Select a person from the list whose voice you want cloned

> If you have a sentence more than 4-5 phrases then divide that long sentence into smaller lines with 4-5 word phrases each. Such as the `sample_text.txt`

3. Enter each line of the text from `sample_text.txt` in the text field of the [web app](https://vo.codes)
4. Download the output from [https://vo.codes/#history](history) once the processing is over
5. Once you have all the individual audio files, upload it to https://clideo.com/merge-wav to merge the audio files into one audio file.