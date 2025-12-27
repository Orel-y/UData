import { useEffect, useState } from 'react';
import { CampusSection } from '../components/CampusSection';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function CampusPage() {
  const navigate = useNavigate();
  const { campuses, fetchCampuses, addCampus, updateCampus, deleteCampus, syncLocalCampusesToBackend } = useData();
  const { currentUser, logout } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const visibleCampuses = currentUser?.permittedCampusIds && currentUser.permittedCampusIds.length > 0
    ? campuses.filter(c => currentUser.permittedCampusIds.includes(c.id))
    : campuses;

  useEffect(() => {
    // Ensure campuses are loaded
    fetchCampuses().catch(err => console.error('Error fetching campuses:', err));
  }, []);

  const handleNavigate = (id: number) => navigate(`/campuses/${id}/buildings`);

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <div />
        <div className='flex items-center gap-2'>
          <button
            onClick={async () => {
              if (!syncLocalCampusesToBackend) return;
              setSyncing(true);
              setSyncMessage(null);
              try {
                const res = await syncLocalCampusesToBackend();
                if (res) {
                  setSyncMessage(`Added ${res.added.length} campuses, skipped ${res.skipped.length}`);
                  // refresh from server so IDs and canonical list are up-to-date
                  await fetchCampuses();
                } else {
                  setSyncMessage('Sync failed');
                }
              } catch (err) {
                setSyncMessage('Sync error');
              } finally {
                setSyncing(false);
                setTimeout(() => setSyncMessage(null), 5000);
              }
            }}
            disabled={syncing}
            className='px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
          >
            {syncing ? 'Syncing...' : 'Sync local → backend'}
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className='mb-4 text-sm text-gray-700'>{syncMessage}</div>
      )}

      <CampusSection
        campuses={visibleCampuses}
        onAdd={addCampus}
        onUpdate={updateCampus}
        onDelete={deleteCampus}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
