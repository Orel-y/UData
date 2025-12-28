from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User

class BaseService:
    def __init__(self, session: AsyncSession, current_user: User):
        self.session = session
        self.current_user = current_user
