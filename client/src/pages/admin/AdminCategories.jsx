import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiTag } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const load = () => {
    adminAPI.getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await adminAPI.createCategory({ name: newName });
      setNewName('');
      load();
      toast.success('Category created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await adminAPI.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success('Category deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Manage Categories</h1>

        <form onSubmit={handleCreate} className="flex gap-3 mb-8">
          <Input placeholder="New category name" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
          <Button type="submit" variant="primary" icon={FiPlus} loading={creating}>Add</Button>
        </form>

        <div className="glass-card rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-dark-400">Loading...</div>
          ) : (
            <div className="divide-y divide-dark-100 dark:divide-dark-800">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between px-6 py-4 hover:bg-dark-50 dark:hover:bg-dark-800/30">
                  <div className="flex items-center gap-3">
                    <FiTag className="text-primary-500" />
                    <span className="font-medium text-dark-900 dark:text-white">{cat.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
