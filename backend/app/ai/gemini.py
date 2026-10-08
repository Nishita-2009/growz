"""
Google Gemini AI service client module.
"""
from typing import Optional, Dict, Any
from app.core.config import settings

class GeminiClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL

    def is_configured(self) -> bool:
        return bool(self.api_key)

    async def generate_growth_insights(self, prompt: str) -> Dict[str, Any]:
        if not self.is_configured():
            return {"error": "GEMINI_API_KEY is not configured in environment variables"}
        # Placeholder for Gemini generative API call
        return {"status": "configured", "model": self.model_name, "prompt": prompt}

gemini_client = GeminiClient()
