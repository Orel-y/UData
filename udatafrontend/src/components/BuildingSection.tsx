import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Building } from 'lucide-react';
import { BuildingStatus, BuildingType as BType, Building as BuildingType, Campus } from '../App';
import { Modal } from './Modal';

interface BuildingSectionProps {
  campusId: string;
  buildings: BuildingType[];
  campuses: Campus[];
  onAdd: (building: Omit<BuildingType, 'id'>) => void;
  onUpdate: (id: string, building: Omit<BuildingType, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function BuildingSection({
  campusId,
  buildings,
  campuses,
  onAdd,
  onUpdate,
  onDelete,
}: BuildingSectionProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<BuildingType | null>(null);

  const [formData, setFormData] = useState({
    code:"",
    name: '',
    floors: 1,
    campus_id:campusId,
    status:BuildingStatus.ACTIVE,
    type:BType.ACADEMIC
  });

  const filteredBuildings = buildings.filter(
    building => building.campus_id === campusId
  );

  const campus = campuses.find(c => c.id === campusId);

  const openAddModal = () => {
    setFormData({code:"", name: '', floors: 1, campus_id:campusId,status:BuildingStatus.ACTIVE,type:BType.ACADEMIC });
    setEditingBuilding(null);
    setIsModalOpen(true);
  };

  const openEditModal = (building: BuildingType) => {
    setFormData({
      code:building.code,
      name: building.name,
      floors: building.floors,
      campus_id: building.campus_id,
      status: building.status,
      type: building.type
    });
    setEditingBuilding(building);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuilding) {
      onUpdate(editingBuilding.id, formData);
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        'Are you sure you want to delete this building? All associated rooms will also be deleted.'
      )
    ) {
      onDelete(id);
    }
  };


  return (
    <section className="bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="svg w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-gray-900">
              {campus?.name} 
            </h2>
            <p className="text-gray-600 text-sm">
              Manage buildings under this campus
            </p>
          </div>
        </div>
        <div className="flex gap-3">
           <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Building
        </button>
        </div>
        
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Building Name</th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Floor Count</th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Type</th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Status</th>
              <th className="text-right py-3 px-4 text-gray-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuildings.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">
                  No buildings found. Click “Add Building” to get started.
                </td>
              </tr>
            ) : (
              filteredBuildings.map(building => (
                <tr
                  key={building.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/buildings/${building.id}/rooms`)}
                >
                  <td className="py-3 px-4 text-blue-600 hover:underline">{building.name}</td>
                  <td className="py-3 px-4 text-gray-600">{building.floors}</td>
                  <td className="py-3 px-4 text-gray-600">{building.type}</td>
                  <td className="py-3 px-4 text-gray-600">{building.status}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(building);
                        }}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit building"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(building.id);
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete building"
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
        title={editingBuilding ? 'Edit Building' : 'Add New Building'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Campus</label>
            <input
              value={campus?.name || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Building Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Building Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Floor Count</label>
            <input
              type="number"
              min={1}
              value={formData.floors}
              onChange={e => setFormData({ ...formData, floors: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Building Type</label>
            <select
              onChange={e =>setFormData({ ...formData, type: e.target.value as BType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required>
                <option value={BType.ACADEMIC} >{BType.ACADEMIC}</option>
                <option value={BType.ADMIN}>{BType.ADMIN}</option>
                <option value={BType.DORM}>{BType.DORM}</option>
                <option value={BType.LAB}>{BType.LAB}</option>
                <option value={BType.LIBRARY}>{BType.LIBRARY}</option>
                <option value={BType.OTHER}>{BType.OTHER}</option>
              </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Building Status</label>
            <select
              onChange={e =>setFormData({ ...formData, status: e.target.value as BuildingStatus })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required>
                <option value={BuildingStatus.ACTIVE} >{BuildingStatus.ACTIVE}</option>
                <option value={BuildingStatus.IN_MAINTENANCE}>{BuildingStatus.IN_MAINTENANCE}</option>
                <option value={BuildingStatus.RETIRED}>{BuildingStatus.RETIRED}</option>
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
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {editingBuilding ? 'Update' : 'Add'} Building
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
