import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, DoorOpen } from 'lucide-react';
import { Room, Building, Campus, RoomType, RoomStatus } from '../App';
import { Modal } from './Modal';

interface RoomSectionProps {
  selectedBuildingId:string,
  rooms: Room[];
  building:Building | undefined;
  campus: Campus | undefined;
  onAdd: (room: Omit<Room, 'id'>) => Promise<Room>;
  onUpdate: (id: string, room: Omit<Room, 'id'>) => Promise<Room>;
  onDelete: (id: string) => void;
}

export function RoomSection({
  selectedBuildingId,
  rooms: initialRooms,
  building,
  campus,
  onAdd,
  onUpdate,
  onDelete,
}: RoomSectionProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Map API rooms to frontend Room type if needed
<<<<<<< HEAD
  // useEffect(() => {
  //   setRooms(
  //     initialRooms.map(r => ({
  //       ...r,
  //       buildingId: (r as any).buildingId ?? (r as any).building_id,
  //     }))
  //   );
  // }, [initialRooms]);
=======
  useEffect(() => {
    setRooms(initialRooms)
    }, [initialRooms]);

>>>>>>> master


  const [formData, setFormData] = useState({
    code:"", // will have the room number
    name: 'room of building'+building?.name,
    capacity: 45,
    floor:1,
    type: RoomType.LECTURE_HALL,
    status:RoomStatus.AVAILABLE,
    meta_info: {"additionalProp1":{}},
    building_id: selectedBuildingId,
  });

  // Update formData buildingId when selectedBuildingId changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, buildingId: selectedBuildingId }));
  }, [selectedBuildingId]);

<<<<<<< HEAD
  const filteredRooms =initialRooms;

=======
>>>>>>> master
  const openAddModal = () => {
    setFormData({
      code: '',
      name: 'room of building'+building?.name,
      capacity: 45,
      floor:1,
      type: RoomType.LECTURE_HALL,
      status: RoomStatus.AVAILABLE,
      meta_info: {"additionalProp1":{}},
      building_id: selectedBuildingId,
    });
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setFormData({
      code: room.code,
      name:room.name,
      floor:room.floor,
      capacity: room.capacity,
      type: room.type as RoomType,
      status: room.status as RoomStatus,
      building_id: room.building_id,
      meta_info: {"additionalProp1":{}},
    });
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      const updated = await onUpdate(editingRoom.id, formData);
      setRooms(prev => prev.map(r => (r.id === editingRoom.id ? updated : r)));
    } else {
      const newroom = await onAdd(formData);
      // Optimistically update the local state so new room shows immediately
      setRooms(prev => [...prev,newroom,]);
    }
    console.log(formData);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      onDelete(id);
      setRooms(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <span><b>Campus: </b>{campus?.name}</span><br/>
      <span><b>Building: </b>{building?.name}</span><br/><br/>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <DoorOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Rooms — {building?.name}</h2>
            <p className="text-gray-600 text-sm">
              Manage rooms under this building
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          disabled={selectedBuildingId === undefined}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Room Number</th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Capacity</th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Room Type</th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Status</th>
              <th className="text-right py-3 px-4 text-gray-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No rooms found. Click “Add Room” to get started.
                </td>
              </tr>
            ) : (
              rooms.map(room => (
                <tr
                  key={room.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/rooms/${room.id}`)}
                >
                  <td className="py-3 px-4 text-blue-600 hover:underline">{room.code}</td>
                  <td className="py-3 px-4 text-gray-600">{room.capacity}</td>
                  <td className="py-3 px-4 text-gray-600">{room.type}</td>
                  <td className="py-3 px-4 text-gray-600">{room.status}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(room);
                        }}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit room"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(room.id);
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Room Number</label>
            <input
              type="text"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Capacity</label>
            <input
              type="number"
              min={0}
              value={formData.capacity}
              onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Room Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as RoomType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required>
                <option value={RoomType.AUDITORIUM}>{RoomType.AUDITORIUM}</option>
                <option value={RoomType.LAB}>{RoomType.LAB}</option>
                <option value={RoomType.LECTURE_HALL}>{RoomType.LECTURE_HALL}</option>
                <option value={RoomType.OFFICE}>{RoomType.OFFICE}</option>
                <option value={RoomType.STORAGE}>{RoomType.STORAGE}</option>
                <option value={RoomType.OTHER}>{RoomType.OTHER}</option>
              </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as RoomStatus})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              required>
                <option value={RoomStatus.AVAILABLE}>{RoomStatus.AVAILABLE}</option>
                <option value={RoomStatus.MAINTENANCE}>{RoomStatus.MAINTENANCE}</option>
                <option value={RoomStatus.OCCUPIED}>{RoomStatus.OCCUPIED}</option>
                <option value={RoomStatus.RETIRED}>{RoomStatus.RETIRED}</option>
              </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {editingRoom ? 'Update' : 'Add'} Room
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
