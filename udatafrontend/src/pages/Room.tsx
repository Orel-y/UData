import { useContext } from "react";
import { AppContext, Room } from "../App";
import { RoomSection } from "../components/RoomSection";
import { useParams } from "react-router";


export default function RoomPage() {
  const { campuses,buildings, rooms, setRooms } = useContext(AppContext);

  const {campusId,buildingId} = useParams();

  const campus = campuses.filter(c=>c.id==campusId)[0];
  const building = buildings.filter(b=>b.id===buildingId)[0];
  console.log(campus,building)

  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom = { ...room, id: Date.now().toString() };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (id: string, room: Omit<Room, 'id'>) => {
    setRooms(rooms.map(r => r.id === id ? { ...room, id } : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  return (
    <div>
            <RoomSection
              rooms={rooms}
              building={building}
              campus={campus}
              onAdd={addRoom}
              onUpdate={updateRoom}
              onDelete={deleteRoom}
            />
    </div>
  )
}
