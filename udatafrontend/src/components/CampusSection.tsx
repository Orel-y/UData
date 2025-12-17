import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { Campus } from '../App';
import { Modal } from './Modal';

interface CampusSectionProps {
  campuses: Campus[];
  onAdd: (campus: Omit<Campus, 'id'>) => void;
  onUpdate: (id: string, campus: Omit<Campus, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function CampusSection({ campuses, onAdd, onUpdate, onDelete }: CampusSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
  const [formData, setFormData] = useState({ name: '', location: '' });

  const openAddModal = () => {
    setFormData({ name: '', location: '' });
    setEditingCampus(null);
    setIsModalOpen(true);
  };

  const openEditModal = (campus: Campus) => {
    setFormData({ name: campus.name, location: campus.location });
    setEditingCampus(campus);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCampus) {
      onUpdate(editingCampus.id, formData);
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campus? All associated buildings and rooms will also be deleted.')) {
      onDelete(id);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Campuses</h2>
            <p className="text-gray-600 text-sm">Manage university campus locations</p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Campus
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Campus Name</th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm">Location</th>
              <th className="text-right py-3 px-4 text-gray-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campuses.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">
                  No campuses added yet. Click &quot;Add Campus&quot; to get started.
                </td>
              </tr>
            ) : (
              campuses.map(campus => (
                <tr key={campus.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{campus.name}</td>
                  <td className="py-3 px-4 text-gray-600">{campus.location}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(campus)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit campus"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(campus.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete campus"
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
        title={editingCampus ? 'Edit Campus' : 'Add New Campus'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="campus-name" className="block text-sm text-gray-700 mb-1">
              Campus Name
            </label>
            <input
              id="campus-name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="campus-location" className="block text-sm text-gray-700 mb-1">
              Location
            </label>
            <input
              id="campus-location"
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingCampus ? 'Update' : 'Add'} Campus
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}