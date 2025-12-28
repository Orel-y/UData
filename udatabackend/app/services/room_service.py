from app.services.base import BaseService
from app.services.exceptions import NotFoundError, ConflictError
from app.repositories.room_repo import RoomRepository
from app.repositories.building_repo import BuildingRepository
from app.models.room import Room
from app.schemas.room import RoomCreate, RoomUpdate

class RoomService(BaseService):

    def __init__(self, session, current_user):
        super().__init__(session, current_user)
        self.repo = RoomRepository(session)
        self.building_repo = BuildingRepository(session)

    async def create_room(self, data: RoomCreate) -> Room:
        # Rule: building must exist
        building = await self.building_repo.get_by_id(data.building_id)
        if not building:
            raise NotFoundError("Building does not exist")

        # Rule: room code unique per building
        existing = await self.repo.get_by_code(data.building_id, data.code)
        if existing:
            raise ConflictError("Room code already exists in this building")

        room = Room(
            building_id=data.building_id,
            code=data.code,
            name=data.name,
            capacity=data.capacity,
            floor=data.floor,
            type=data.type,
            metadata=data.metadata,
            created_by=self.current_user,
        )

        return await self.repo.create(room)

    async def get_room(self, room_id):
        room = await self.repo.get_by_id(room_id)
        if not room:
            raise NotFoundError("Room not found")
        return room

    async def update_room(self, room_id, data: RoomUpdate):
        room = await self.get_room(room_id)

        updated = await self.repo.update(
            room,
            {
                **data.model_dump(exclude_unset=True),
                "updated_by": self.current_user,
            }
        )
        return updated

    async def delete_room(self, room_id):
        room = await self.get_room(room_id)
        room.updated_by = self.current_user
        return await self.repo.soft_delete(room)
