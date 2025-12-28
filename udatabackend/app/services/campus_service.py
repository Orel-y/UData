from app.services.base import BaseService
from app.services.exceptions import NotFoundError, ConflictError
from app.repositories.campus_repo import CampusRepository
from app.models.campus import Campus
from app.schemas.campus import CampusCreate, CampusUpdate

class CampusService(BaseService):

    def __init__(self, session, current_user):
        super().__init__(session, current_user)
        self.repo = CampusRepository(session)

    async def create_campus(self, data: CampusCreate) -> Campus:
        # Business rule: campus code must be unique
        existing = await self.repo.get_by_code(data.code)
        if existing:
            raise ConflictError("Campus with this code already exists")

        campus = Campus(
            code=data.code,
            name=data.name,
            address=data.address,
            created_by=self.current_user,
        )

        return await self.repo.create(campus)

    async def get_campus(self, campus_id):
        campus = await self.repo.get_by_id(campus_id)
        if not campus:
            raise NotFoundError("Campus not found")
        return campus

    async def update_campus(self, campus_id, data: CampusUpdate):
        campus = await self.get_campus(campus_id)

        updated = await self.repo.update(
            campus,
            {
                **data.model_dump(exclude_unset=True),
                "updated_by": self.current_user,
            }
        )
        return updated

    async def delete_campus(self, campus_id):
        campus = await self.get_campus(campus_id)
        campus.updated_by = self.current_user
        return await self.repo.soft_delete(campus)
