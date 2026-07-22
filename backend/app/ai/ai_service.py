"""Gemini integration for Neko's conversational responses."""

import os
import logging

from fastapi import HTTPException

logger = logging.getLogger(__name__)


def generate_response(prompt: str) -> str:
    """
    Generate a response from Google's Gemini API.
    This function should NEVER return fake or hardcoded replies.
    """

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Gemini is not configured. Add GEMINI_API_KEY to backend/.env and restart the API.",
        )

    try:
        from google import genai

        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-2.0-flash"),
            contents=prompt,
        )

        reply = (response.text or "").strip()

        if not reply:
            raise RuntimeError("Gemini returned an empty response.")

        return reply

    except HTTPException:
        raise

    except Exception as error:
        logger.exception("Gemini API Error")

        raise HTTPException(
            status_code=502,
            detail="Neko could not reach Gemini. Please try again.",
        ) from error