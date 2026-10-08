import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { courseAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', shortDescription: '', price: 0,
    category: '', level: 'beginner', language: 'English',
    outcomes: [''], requirements: [''],
  });

  useEffect(() => {
    courseAPI.getCategories()
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => {});
  }, []);

  const addItem = (field) => setForm({ ...form, [field]: [...form[field], ''] });
  const updateItem = (field, index, value) => {
    const items = [...form[field]];
    items[index] = value;
    setForm({ ...form, [field]: items });
  };
  const removeItem = (field, index) => {
    if (form[field].length > 1) {
      setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await courseAPI.create({
        ...form,
        outcomes: form.outcomes.filter((o) => o.trim()),
        requirements: form.requirements.filter((r) => r.trim()),
      });
      toast.success('Course created!');
      navigate(`/instructor/courses/${res.data.course._id}/edit`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-200 mb-6 transition-colors">
          <FiArrowLeft /> Back
        </button>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Create New Course</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-dark-900 dark:text-white">Basic Information</h2>
            <Input label="Course Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-dark-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50" required />
            </div>
            <Input label="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-dark-900 dark:text-white">Pricing & Category</h2>
            <Input label="Price ($)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-dark-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50" required>
                <option value="">Select category</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Level</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-dark-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all-levels">All Levels</option>
              </select>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-dark-900 dark:text-white">Learning Outcomes</h2>
            {form.outcomes.map((outcome, i) => (
              <div key={i} className="flex gap-2">
                <Input value={outcome} onChange={(e) => updateItem('outcomes', i, e.target.value)} placeholder={`Outcome ${i + 1}`} />
                <button type="button" onClick={() => removeItem('outcomes', i)} className="px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">x</button>
              </div>
            ))}
            <button type="button" onClick={() => addItem('outcomes')} className="text-sm text-primary-500 hover:text-primary-600">+ Add outcome</button>
          </div>

          <Button type="submit" variant="gradient" size="lg" icon={FiSave} loading={loading}>
            Create Course
          </Button>
        </form>
      </div>
    </div>
  );
}
