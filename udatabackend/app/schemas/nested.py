from app.schemas.base import BaseSchema
from app.schemas.room import RoomResponse
from app.schemas.building import BuildingResponse
from app.schemas.campus import CampusResponse

class BuildingWithRooms(BuildingResponse):
    rooms: list[RoomResponse]

class CampusWithBuildings(CampusResponse):
    buildings: list[BuildingWithRooms]
