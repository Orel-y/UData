from enum import Enum

class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    DISABLED = "DISABLED"
    SUSPENDED = "SUSPENDED"

class CampusStatus(str, Enum):
    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"

class BuildingStatus(str, Enum):
    ACTIVE = "ACTIVE"
    IN_MAINTENANCE = "IN_MAINTENANCE"
    RETIRED = "RETIRED"

class RoomStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    OCCUPIED = "OCCUPIED"
    MAINTENANCE = "MAINTENANCE"
    RETIRED = "RETIRED"

class BuildingType(str, Enum):
    ACADEMIC = "ACADEMIC"
    ADMIN = "ADMIN"
    DORM = "DORM"
    LIBRARY = "LIBRARY"
    LAB = "LAB"
    OTHER = "OTHER"

class RoomType(str, Enum):
    LECTURE_HALL = "LECTURE_HALL"
    LAB = "LAB"
    OFFICE = "OFFICE"
    STORAGE = "STORAGE"
    AUDITORIUM = "AUDITORIUM"
    OTHER = "OTHER"
