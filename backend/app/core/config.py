from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Growz"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # CORS Settings
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"

    @property
    def ALLOWED_HOSTS(self) -> list[str]:
        if isinstance(self.CORS_ORIGINS, str):
            return [host.strip() for host in self.CORS_ORIGINS.split(",") if host.strip()]
        return ["*"]

    # Database Settings
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "growz_user"
    POSTGRES_PASSWORD: str = "growz_password"
    POSTGRES_DB: str = "growz_db"

    DATABASE_URL: Optional[str] = None
    USE_SQLITE: bool = False
    SQLITE_DB_FILE: str = "growz.db"

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URL:
            import urllib.parse
            db_url = self.DATABASE_URL.strip()
            if db_url.startswith("postgres://"):
                db_url = "postgresql://" + db_url[len("postgres://"):]

            if db_url.startswith("postgresql://") or db_url.startswith("postgresql+psycopg2://"):
                scheme = "postgresql+psycopg2://"
                prefix = "postgresql://" if db_url.startswith("postgresql://") else "postgresql+psycopg2://"
                body = db_url[len(prefix):]
                if "@" in body:
                    userpass, hostdb = body.rsplit("@", 1)
                    if ":" in userpass:
                        user, raw_pass = userpass.split(":", 1)
                        encoded_pass = urllib.parse.quote(raw_pass, safe="")
                        return f"{scheme}{user}:{encoded_pass}@{hostdb}"
                return f"{scheme}{body}"
            return db_url
        if self.USE_SQLITE:
            return f"sqlite:///{self.SQLITE_DB_FILE}"
        return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis Settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # Firebase Authentication & Storage Settings
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    FIREBASE_SERVICE_ACCOUNT_JSON: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_CLIENT_EMAIL: Optional[str] = None
    FIREBASE_STORAGE_BUCKET: Optional[str] = None

    # AI Settings (Google Gemini)
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.5-flash"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
