"""
YouTube Service — Extracts transcript and metadata from YouTube videos.

This service handles:
1. URL validation (ensures the link is actually a YouTube video)
2. Transcript extraction (the speech from the video)
3. Metadata extraction (title, description, thumbnail, duration)
"""

import re
from youtube_transcript_api import YouTubeTranscriptApi
import yt_dlp


# Maximum allowed video duration (30 minutes)
MAX_VIDEO_DURATION_SECONDS = 1800


def validate_youtube_url(url: str) -> str:
    """
    Validates a YouTube URL and extracts the video ID.
    
    Supports formats:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/shorts/VIDEO_ID
    
    Returns the video_id string, or raises ValueError if invalid.
    """
    patterns = [
        r'(?:youtube\.com/watch\?v=)([a-zA-Z0-9_-]{11})',   # Standard URL
        r'(?:youtu\.be/)([a-zA-Z0-9_-]{11})',                 # Short URL
        r'(?:youtube\.com/shorts/)([a-zA-Z0-9_-]{11})',       # Shorts URL
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    raise ValueError("Invalid YouTube URL. Please paste a valid YouTube video link.")


def fetch_transcript(video_id: str) -> str | None:
    """
    Fetches the transcript (speech) from a YouTube video.
    
    Strategy:
    1. Try English captions first (manual or auto-generated)
    2. If English isn't available, try any available language
    3. If no captions exist at all, return None (don't crash)
    
    Returns the full transcript as a single string, or None.
    """
    try:
        # First, try to get English transcript
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        # Try manually created English captions first (highest quality)
        try:
            transcript = transcript_list.find_manually_created_transcript(['en'])
        except Exception:
            # Fall back to auto-generated English
            try:
                transcript = transcript_list.find_generated_transcript(['en'])
            except Exception:
                # Fall back to ANY available language
                try:
                    available = list(transcript_list)
                    if available:
                        transcript = available[0]
                    else:
                        return None
                except Exception:
                    return None
        
        # Convert transcript segments into a single string
        segments = transcript.fetch()
        full_text = " ".join(segment.get("text", "") for segment in segments)
        return full_text.strip() if full_text.strip() else None
        
    except Exception:
        # Video has no captions at all, or API is blocked
        return None


def fetch_metadata(url: str) -> dict:
    """
    Fetches video metadata from YouTube WITHOUT downloading the video.
    
    Uses yt-dlp with download=False for speed.
    
    Returns a dict with: title, description, thumbnail, duration, uploader
    Raises ValueError if the video is too long or cannot be accessed.
    """
    ydl_opts = {
        'skip_download': True,
        'quiet': True,              # Don't print logs to console
        'no_warnings': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            duration = info.get('duration', 0) or 0
            
            # Check video duration limit
            if duration > MAX_VIDEO_DURATION_SECONDS:
                raise ValueError(
                    f"Video is too long ({duration // 60} minutes). "
                    f"Please use videos under {MAX_VIDEO_DURATION_SECONDS // 60} minutes."
                )
            
            return {
                "title": info.get("title", ""),
                "description": info.get("description", ""),
                "thumbnail": info.get("thumbnail", ""),
                "duration": duration,
                "uploader": info.get("uploader", ""),
            }
    except yt_dlp.utils.DownloadError as e:
        raise ValueError(f"Could not access video: {str(e)}")


def collect_video_data(url: str) -> dict:
    """
    Main function — collects ALL available data from a YouTube video.
    
    This is the function that the AI service will call.
    
    Returns a dict with:
    - video_id: The YouTube video ID
    - title: Video title
    - description: Video description box content
    - thumbnail: Thumbnail URL
    - duration: Duration in seconds
    - transcript: Full speech text (or None if unavailable)
    - has_transcript: Boolean flag
    
    Raises ValueError if:
    - URL is invalid
    - Video is too long
    - Video cannot be accessed
    - No useful text sources found (no transcript AND no description)
    """
    # Step 1: Validate URL and extract video ID
    video_id = validate_youtube_url(url)
    
    # Step 2: Fetch metadata (title, description, thumbnail, duration)
    metadata = fetch_metadata(url)
    
    # Step 3: Fetch transcript (may return None)
    transcript = fetch_transcript(video_id)
    
    # Step 4: Check if we have enough data to work with
    has_transcript = transcript is not None
    has_description = bool(metadata["description"] and len(metadata["description"]) > 50)
    
    if not has_transcript and not has_description:
        raise ValueError(
            "This video doesn't have enough text information "
            "(no captions and no meaningful description). "
            "Please try a different video or create the recipe manually."
        )
    
    return {
        "video_id": video_id,
        "title": metadata["title"],
        "description": metadata["description"],
        "thumbnail": metadata["thumbnail"],
        "duration": metadata["duration"],
        "uploader": metadata["uploader"],
        "transcript": transcript,
        "has_transcript": has_transcript,
    }
