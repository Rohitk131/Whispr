import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
import numpy as np
from faster_whisper import WhisperModel
import asyncio
from scipy import signal

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Whisper model
try:
    model = WhisperModel("base", device="cpu", compute_type="int8")
    logger.info("Whisper model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {e}")
    model = None

class TranscriptionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if model is None:
            await self.close(code=1011)
            return
        
        self.audio_chunks = []
        self.sample_rate = 16000  # Whisper expects 16kHz
        self.chunk_duration = 2.0  # Process 2 seconds of audio at a time
        self.min_chunks = int(self.chunk_duration * self.sample_rate / 2048)  # Calculate based on processor size
        await self.accept()
        logger.info("New WebSocket connection established")

    async def disconnect(self, close_code):
        logger.info(f"WebSocket disconnected with code: {close_code}")
        self.audio_chunks = []

    async def receive(self, text_data=None, bytes_data=None):
        if bytes_data:
            try:
                # Convert from Int16 to float32 and normalize
                data = np.frombuffer(bytes_data, dtype=np.int16).astype(np.float32)
                data = data / 32768.0  # Normalize to [-1, 1]

                # Resample to 16kHz if needed (assuming input is 44.1kHz)
                resampled = signal.resample(data, int(len(data) * self.sample_rate / 44100))
                self.audio_chunks.append(resampled)

                # Process when we have enough audio
                if len(self.audio_chunks) >= self.min_chunks:
                    audio_data = np.concatenate(self.audio_chunks)
                    self.audio_chunks = []

                    # Run transcription in thread pool
                    try:
                        loop = asyncio.get_event_loop()
                        result = await loop.run_in_executor(None, self.transcribe_audio, audio_data)
                        if result.strip():  # Only send if we got meaningful text
                            await self.send(text_data=json.dumps({"text": result}))
                    except Exception as e:
                        logger.error(f"Transcription error: {e}")
                        await self.send(text_data=json.dumps({"error": "Failed to transcribe audio"}))

            except Exception as e:
                logger.error(f"Error processing audio data: {e}")
                await self.send(text_data=json.dumps({"error": "Failed to process audio data"}))

    def transcribe_audio(self, audio_data):
        try:
            segments, _ = model.transcribe(audio_data, 
                                         beam_size=1,
                                         language="en",
                                         condition_on_previous_text=True,
                                         compression_ratio_threshold=2.4)
            return " ".join(segment.text for segment in segments)
        except Exception as e:
            logger.error(f"Whisper transcription error: {e}")
            return ""
