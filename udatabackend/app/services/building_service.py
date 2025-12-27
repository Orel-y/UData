from app.services.base import BaseService
from app.services.exceptions import NotFoundError, ConflictError
from app.repositories.building_repo import BuildingRepository
from app.repositories.campus_repo import CampusRepository
from app.models.building import Building
from app.schemas.building import BuildingCreate, BuildingUpdate

class BuildingService(BaseService):

    def __init__(self, session, current_user):
        super().__init__(session, current_user)
        self.repo = BuildingRepository(session)
        self.campus_repo = CampusRepository(session)

    async def create_building(self, data: BuildingCreate) -> Building:
        # Rule: campus must exist
        campus = await self.campus_repo.get_by_id(data.campus_id)
        if not campus:
            raise NotFoundError("Campus does not exist")

        # Rule: building code unique per campus
        existing = await self.repo.get_by_code(data.campus_id, data.code)
        if existing:
            raise ConflictError("Building code already exists in this campus")

        building = Building(
            campus_id=data.campus_id,
            code=data.code,
            name=data.name,
            floors=data.floors,
            type=data.type,
            created_by=self.current_user,
        )

        return await self.repo.create(building)

    async def get_building(self, building_id):
        building = await self.repo.get_by_id(building_id)
        if not building:
            raise NotFoundError("Building not found")
        return building

    async def update_building(self, building_id, data: BuildingUpdate):
        building = await self.get_building(building_id)

        updated = await self.repo.update(
            building,
            {
                **data.model_dump(exclude_unset=True),
                "updated_by": self.current_user,
            }
        )
        return updated

    async def delete_building(self, building_id):
        building = await self.get_building(building_id)
        building.updated_by = self.current_user
        return await self.repo.soft_delete(building)
