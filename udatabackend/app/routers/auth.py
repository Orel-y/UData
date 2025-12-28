from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth.security import verify_password, create_access_token
from app.core.database import get_session
from app.repositories.user_repo import UserRepository
from app.schemas.auth import LoginRequest, TokenResponse, RegisterRequest, RegisterResponse
from app.services.user_service import UserService


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=RegisterResponse)
async def register_user(payload: RegisterRequest, db: AsyncSession = Depends(get_session)):
    user_repo = UserRepository(db)
    user_service = UserService(user_repo)

    return await user_service.register_user(
        full_name=payload.full_name,
        username=payload.username,
        email=str(payload.email),
        password=payload.password,
        role=payload.role,

    )

@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    user = await repo.get_by_username(payload.username)

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=access_token)



