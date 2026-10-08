from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.services.firebase import verify_firebase_token
from app.models.models import User, Organization, UserOrganization, RoleEnum, Business

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    try:
        payload = verify_firebase_token(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    firebase_uid = payload.get("uid")
    email = payload.get("email")

    if not firebase_uid or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing required fields",
        )

    # Fetch user from DB or auto-provision on first sign in
    stmt = select(User).where(User.firebase_uid == firebase_uid)
    user = db.execute(stmt).scalar_one_or_none()

    if not user:
        # Auto-create user record & default Organization
        user = User(
            firebase_uid=firebase_uid,
            email=email,
            full_name=payload.get("name"),
            avatar_url=payload.get("picture"),
        )
        db.add(user)
        db.flush()

        # Create default MSME organization for user
        default_org = Organization(
            name=f"{payload.get('name', 'My')}'s Business",
            slug=f"org-{user.id.hex[:8]}",
            business_type="MSME"
        )
        db.add(default_org)
        db.flush()

        # Create link
        link = UserOrganization(
            user_id=user.id,
            organization_id=default_org.id,
            role=RoleEnum.OWNER
        )
        db.add(link)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )

    return user


DEFAULT_DEV_BUSINESS_NAME = "Development Active Business"


def get_current_business(
    db: Session = Depends(get_db),
    x_business_id: Optional[str] = Header(None, alias="X-Business-ID")
) -> Business:
    """
    DEVELOPMENT ACTIVE BUSINESS SELECTION MECHANISM:

    1. If `X-Business-ID` header is passed, attempts to find the matching `Business` record.
    2. If no header is provided or during dev testing, fetches the default development `Business` record or creates one.

    FUTURE COMPATIBILITY:
    This dependency cleanly isolates business context and can easily be upgraded to resolve
    `current_user.business` once Firebase tenant auth is wired up.
    """
    import uuid

    if x_business_id:
        try:
            b_uuid = uuid.UUID(x_business_id)
            stmt = select(Business).where(Business.id == b_uuid)
            business = db.execute(stmt).scalar_one_or_none()
            if business:
                return business
        except ValueError:
            pass

    # Dev fallback: find or create default development business
    stmt = select(Business).where(Business.name == DEFAULT_DEV_BUSINESS_NAME)
    business = db.execute(stmt).scalars().first()

    if not business:
        business = Business(
            name=DEFAULT_DEV_BUSINESS_NAME,
            business_type="Retail & MSME Development"
        )
        db.add(business)
        db.commit()
        db.refresh(business)

    return business
