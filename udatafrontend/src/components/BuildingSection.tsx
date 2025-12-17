import { useState } from 'react';
import { Plus, Pencil, Trash2, Building } from 'lucide-react';
import { Building as BuildingType, Campus } from '../App';
import { Modal } from './Modal';
import { useNavigate} from 'react-router';

interface BuildingSectionProps {
  campus: Campus;
  currentCampusBuildings: BuildingType[];
  onAdd: (building: Omit<BuildingType, 'id'>) => void;
  onUpdate: (id: string, building: Omit<BuildingType, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function BuildingSection({ campus,currentCampusBuildings, onAdd, onUpdate, onDelete }: BuildingSectionProps) {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<BuildingType | null>(null);
  const [formData, setFormData] = useState({ name: '', floorCount: 1, campusId: '' });


  const openAddModal = () => {
    setFormData({ name: '', floorCount: 1, campusId: campus.id || ''});
    setEditingBuilding(null);
    setIsModalOpen(true);
  };

  const openEditModal = (building: BuildingType) => {
    setFormData({ name: building.name, floorCount: building.floorCount, campusId: building.campusId });
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
    if (confirm('Are you sure you want to delete this building? All associated rooms will also be deleted.')) {
      onDelete(id);
    }
  };

  const handleBuildingClick = (building: BuildingType)=>{
    navigate(`building/${building.id}`);
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div>
        <h2 className='font-lm font-bold'><b>Campus:</b> {campus.name}</h2><br/>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Buildings</h2>
            <p className="text-gray-600 text-sm">Manage buildings within campuses</p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          disabled={campus == null}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Building
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="campus-filter" className="block text-lm text-gray-700 font-bold mb-2">
          Buildings of {campus?.name}
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Building Name</th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Campus</th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Floor Count</th>
              <th className="text-right py-3 px-4 text-gray-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campus == null ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Please add a campus first before adding buildings.
                </td>
              </tr>
            ) : currentCampusBuildings.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No buildings found. Click &quot;Add Building&quot; to get started.
                </td>
              </tr>
            ) : (
              currentCampusBuildings.map(building => {
                return (
                  <tr key={building.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900" onClick={()=>handleBuildingClick(building)}>{building.name}</td>
                    <td className="py-3 px-4 text-gray-600" onClick={()=>handleBuildingClick(building)}>{campus?.name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-gray-600" onClick={()=>handleBuildingClick(building)}>{building.floorCount}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(building)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit building"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(building.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete building"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
            <label htmlFor="building-campus" className="block text-sm text-gray-700 mb-1">
              Campus
            </label>
            <div className="w-100 px-3 py-2 border-b border-gray-300">{campus?.name}</div>
          </div>
          <div>
            <label htmlFor="building-name" className="block text-sm text-gray-700 mb-1">
              Building Name
            </label>
            <input
              id="building-name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="building-floors" className="block text-sm text-gray-700 mb-1">
              Floor Count
            </label>
            <input
              id="building-floors"
              type="number"
              min="1"
              value={formData.floorCount}
              onChange={e => setFormData({ ...formData, floorCount: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingBuilding ? 'Update' : 'Add'} Building
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
