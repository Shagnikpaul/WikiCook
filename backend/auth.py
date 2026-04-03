from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database.connection import get_db


async def get_current_user(request: Request, db: Session = Depends(get_db)):

    session_token = request.cookies.get("better-auth.session_token")

    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # The cookie value format from Better Auth is "token.signature"
    # We need just the token part to look up in the session table
    token = session_token.split(".")[0] if "." in session_token else session_token

    result = db.execute(
        __import__('sqlalchemy').text(
            "SELECT \"userId\", \"expiresAt\" FROM session WHERE token = :token"
        ),
        {"token": token}
    ).fetchone()

    if not result:
        raise HTTPException(status_code=401, detail="Invalid session")

    user_id, expires_at = result
    from datetime import datetime, timezone
    if expires_at and expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")

    return user_id


async def get_optional_user(request: Request, db: Session = Depends(get_db)):
    session_token = request.cookies.get("better-auth.session_token")

    if not session_token:
        return None

    # The cookie value format from Better Auth is "token.signature"
    # We need just the token part to look up in the session table
    token = session_token.split(".")[0] if "." in session_token else session_token

    result = db.execute(
        __import__('sqlalchemy').text(
            "SELECT \"userId\", \"expiresAt\" FROM session WHERE token = :token"
        ),
        {"token": token}
    ).fetchone()

    if not result:
        return None

    user_id, expires_at = result
    from datetime import datetime, timezone
    if expires_at and expires_at < datetime.now(timezone.utc):
        return None

    return user_id
