"""
Whisper Service — Downloads video audio and transcribes it using Groq Whisper.

This service is used as a FALLBACK when YouTube captions are unavailable.

Pipeline:
    YouTube URL → yt-dlp (audio only) → Groq Whisper API → English text

Key design decisions:
- Always outputs in English (translates from any language automatically)
- Uses imageio-ffmpeg for portable ffmpeg (no system install needed)
- Uses job_id as filename to prevent concurrent request collisions
- Always deletes the audio file in a finally block (no disk buildup)
- If ANYTHING fails, raises ValueError so the job is marked as failed
"""

import os
import yt_dlp
import imageio_ffmpeg
from groq import Groq


# Groq Whisper limits
MAX_AUDIO_SIZE_BYTES = 25 * 1024 * 1024  # 25MB hard limit from Groq


def download_audio(youtube_url: str, job_id: str, output_dir: str) -> str:
    """
    Downloads only the audio track from a YouTube video.

    Uses yt-dlp with imageio-ffmpeg (portable, no system install needed).
    Saves as {job_id}.mp3 in the output_dir.

    Returns the full path to the downloaded audio file.
    Raises ValueError if the download fails.
    """
    output_path = os.path.join(output_dir, f"{job_id}.mp3")
    ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()

    ydl_opts = {
        # Download only audio, convert to mp3
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(output_dir, f"{job_id}.%(ext)s"),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '64',       # Low quality = smaller file = faster upload
        }],
        'ffmpeg_location': ffmpeg_path,     # Use bundled ffmpeg
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])
    except Exception as e:
        raise ValueError(
            f"Could not download video audio. Please try again later. "
            f"(Details: {str(e)})"
        )

    # Verify the file was actually created
    if not os.path.exists(output_path):
        raise ValueError(
            "Could not download video audio. Please try again later."
        )

    return output_path


def check_file_size(audio_path: str) -> None:
    """
    Checks that the audio file is within Groq's 25MB limit.
    Raises ValueError if too large.
    """
    size = os.path.getsize(audio_path)
    if size > MAX_AUDIO_SIZE_BYTES:
        size_mb = size / (1024 * 1024)
        raise ValueError(
            f"Video audio is too large to process ({size_mb:.1f}MB). "
            f"Please try a shorter video (under ~60 minutes)."
        )


def transcribe_audio(audio_path: str) -> str:
    """
    Sends the audio file to Groq Whisper for transcription.

    Uses task="translate" which:
    - Listens in ANY language (Hindi, Telugu, Tamil, English, etc.)
    - Always outputs in English

    Returns the English transcript as a string.
    Raises ValueError if the API call fails.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in environment variables.")

    client = Groq(api_key=api_key)

    try:
        with open(audio_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=audio_file,
                response_format="text",     # Returns plain string
                language="en",              # Hint: expect English (or close to it)
            )
        # Response is a plain string in "text" mode
        transcript = str(response).strip()
        if not transcript:
            raise ValueError(
                "Whisper returned an empty transcript. "
                "The audio may be silent or unclear."
            )
        return transcript

    except ValueError:
        raise  # Re-raise our own errors
    except Exception as e:
        raise ValueError(
            f"Could not transcribe audio. Please try again later. "
            f"(Details: {str(e)})"
        )


def transcribe_from_url(youtube_url: str, job_id: str) -> str:
    """
    Main entry point — downloads audio from a YouTube URL and transcribes it.

    This is the function called by youtube_service when captions are missing.

    Args:
        youtube_url: Full YouTube URL (e.g. https://www.youtube.com/watch?v=...)
        job_id: Unique job ID used as the temp filename to prevent collisions

    Returns:
        English transcript string

    Raises:
        ValueError: With a user-friendly message if anything goes wrong
    """
    # Locate the temp_audio directory (same level as this file's parent)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(base_dir, "temp_audio")
    os.makedirs(output_dir, exist_ok=True)

    audio_path = None

    try:
        print(f"[WHISPER] Downloading audio for job {job_id}...")
        audio_path = download_audio(youtube_url, job_id, output_dir)

        print(f"[WHISPER] Checking file size: {os.path.getsize(audio_path) / 1024 / 1024:.1f}MB")
        check_file_size(audio_path)

        print(f"[WHISPER] Sending to Groq Whisper for transcription...")
        transcript = transcribe_audio(audio_path)

        print(f"[WHISPER] Transcription complete. {len(transcript)} characters.")
        return transcript

    finally:
        # ALWAYS delete the audio file, even if transcription failed
        if audio_path and os.path.exists(audio_path):
            os.remove(audio_path)
            print(f"[WHISPER] Cleaned up temp file: {audio_path}")
