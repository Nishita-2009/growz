import logging
import os
import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings

logger = logging.getLogger(__name__)

_firebase_app = None

def init_firebase():
    global _firebase_app
    if _firebase_app:
        return _firebase_app

    project_id = settings.FIREBASE_PROJECT_ID or os.getenv("FIREBASE_PROJECT_ID") or os.getenv("GOOGLE_CLOUD_PROJECT")
    if not project_id:
        raise ValueError(
            "FIREBASE_PROJECT_ID environment variable is missing in backend configuration. "
            "Please set FIREBASE_PROJECT_ID in backend/.env."
        )

    os.environ["GOOGLE_CLOUD_PROJECT"] = project_id

    options = {"projectId": project_id}
    if settings.FIREBASE_STORAGE_BUCKET:
        options["storageBucket"] = settings.FIREBASE_STORAGE_BUCKET

    cred_path = settings.FIREBASE_CREDENTIALS_PATH or os.getenv("FIREBASE_CREDENTIALS_PATH") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    json_cred = settings.FIREBASE_SERVICE_ACCOUNT_JSON or os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON") or os.getenv("FIREBASE_CREDENTIALS_JSON")

    if cred_path:
        if not os.path.exists(cred_path):
            raise FileNotFoundError(
                f"Firebase service account JSON file not found at path: '{cred_path}'. "
                f"Please place your service account JSON file at this path or update FIREBASE_CREDENTIALS_PATH in backend/.env."
            )
        cred = credentials.Certificate(cred_path)
        _firebase_app = firebase_admin.initialize_app(cred, options=options)
        logger.info(f"Firebase Admin initialized using service account file '{cred_path}' for project '{project_id}'.")
    elif json_cred:
        import json
        cert_dict = json.loads(json_cred)
        cred = credentials.Certificate(cert_dict)
        _firebase_app = firebase_admin.initialize_app(cred, options=options)
        logger.info(f"Firebase Admin initialized using service account JSON environment variable for project '{project_id}'.")
    elif settings.FIREBASE_PRIVATE_KEY and settings.FIREBASE_CLIENT_EMAIL:
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": project_id,
            "private_key": settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
            "client_email": settings.FIREBASE_CLIENT_EMAIL,
        })
        _firebase_app = firebase_admin.initialize_app(cred, options=options)
        logger.info(f"Firebase Admin initialized using service account environment credentials for project '{project_id}'.")
    else:
        raise FileNotFoundError(
            "Firebase Service Account JSON credential is missing! "
            "To verify real Firebase authentication tokens in FastAPI, set FIREBASE_CREDENTIALS_PATH, "
            "FIREBASE_SERVICE_ACCOUNT_JSON, or FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL in environment variables."
        )

    return _firebase_app


def verify_firebase_token(token: str) -> dict:
    """
    Verify Firebase ID token using Firebase Admin SDK.
    Returns token payload dict on success.
    """
    if settings.ENVIRONMENT == "development" and token.startswith("dev-token-"):
        uid = token.replace("dev-token-", "")
        return {
            "uid": uid,
            "email": f"{uid}@example.com",
            "name": f"Dev User {uid}",
            "picture": None
        }

    app = init_firebase()
    decoded_token = auth.verify_id_token(token, app=app)
    return decoded_token



