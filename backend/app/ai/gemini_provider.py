import google.generativeai as genai
from typing import Optional
from app.ai.provider import BaseAIProvider, AIProviderError
from app.core.config import settings

class GeminiProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.GEMINI_MODEL or "gemini-3.5-flash"

        if not self.api_key or not self.api_key.strip():
            raise AIProviderError("Gemini API Key is missing. Please configure GEMINI_API_KEY in backend/.env")

        genai.configure(api_key=self.api_key)

    def generate_business_advice(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction,
                generation_config={"response_mime_type": "application/json"}
            )
            response = model.generate_content(prompt)
            if not response or not response.text:
                raise AIProviderError("Empty response returned from Gemini API.")
            return response.text
        except Exception as e:
            if isinstance(e, AIProviderError):
                raise e
            raise AIProviderError(f"Gemini API request failed: {str(e)}")
