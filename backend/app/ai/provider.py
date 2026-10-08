from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class AIProviderError(Exception):
    """Base exception for AI provider errors."""
    pass

class BaseAIProvider(ABC):
    @abstractmethod
    def generate_business_advice(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """Generate raw advice response string from AI provider."""
        pass
