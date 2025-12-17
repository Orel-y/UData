import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Campus } from '../App';
import { Modal } from './Modal';

interface CampusSectionProps {
  campuses: Campus[];
  onAdd: (campus: Omit<Campus, 'id'>) => void;
  onUpdate: (id: number, campus: Omit<Campus, 'id'>) => void;
  onDelete: (id: number) => void;
  onNavigate?: (id: number) => void;
}

export function CampusSection({ campuses, onAdd, onUpdate, onDelete, onNavigate }: CampusSectionProps) {
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

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this campus?')) {
      onDelete(id);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900 text-lg">Campuses</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Campus
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {campuses.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No campuses found. Click &quot;Add Campus&quot; to get started.
          </div>
        ) : (
          campuses.map(campus => (
            <div
              key={campus.id}
              onClick={() => onNavigate?.(campus.id)}
              className="bg-white p-4 rounded-lg border cursor-pointer hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <h2 className="text-blue-600 text-lg">{campus.name}</h2>
                <p className="text-gray-500">{campus.location}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={e => { e.stopPropagation(); openEditModal(campus); }}
                  className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit campus"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(campus.id); }}
                  className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete campus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCampus ? 'Edit Campus' : 'Add Campus'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
