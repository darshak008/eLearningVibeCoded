import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiSave, FiPlus, FiTrash2, FiArrowLeft, FiChevronDown,
  FiMenu, FiPlay, FiFileText,
} from 'react-icons/fi';
import { courseAPI, moduleAPI, lessonAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Tabs from '../../components/ui/Tabs';
import toast from 'react-hot-toast';

export default function EditCourse({ mode = 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', price: 0, level: 'beginner',
  });

  useEffect(() => {
    if (!id) return;
    Promise.all([
      courseAPI.update(id, {}).catch(() => {}),
      moduleAPI.getByCourse(id).catch(() => ({ data: { modules: [] } })),
    ])
      .then(([courseRes, moduleRes]) => {
        if (courseRes?.data?.course) setCourse(courseRes.data.course);
        setModules(moduleRes.data.modules || []);
      })
      .catch(() => navigate('/instructor/courses'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveCourse = async () => {
    setSaving(true);
    try {
      await courseAPI.update(id, form);
      toast.success('Course updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const addModule = async () => {
    const title = prompt('Module title:');
    if (!title) return;
    try {
      const res = await moduleAPI.create(id, { title });
      setModules((prev) => [...prev, res.data.module]);
      toast.success('Module created');
    } catch (err) {
      toast.error('Failed to create module');
    }
  };

  const deleteModule = async (moduleId) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    try {
      await moduleAPI.delete(id, moduleId);
      setModules((prev) => prev.filter((m) => m._id !== moduleId));
      toast.success('Module deleted');
    } catch {}
  };

  const addLesson = async (moduleId) => {
    const title = prompt('Lesson title:');
    if (!title) return;
    try {
      const res = await lessonAPI.create(moduleId, { title });
      setModules((prev) => prev.map((m) =>
        m._id === moduleId
          ? { ...m, lessons: [...(m.lessons || []), res.data.lesson] }
          : m
      ));
      toast.success('Lesson created');
    } catch {}
  };

  if (loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/instructor/courses')} className="flex items-center gap-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-200 mb-6 transition-colors">
          <FiArrowLeft /> Back to Courses
        </button>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">{course?.title || 'Edit Course'}</h1>

        <Tabs
          tabs={[
            { id: 'details', label: 'Details' },
            { id: 'curriculum', label: 'Curriculum' },
            { id: 'pricing', label: 'Pricing' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {activeTab === 'details' && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl" />
            </div>
            <Button onClick={handleSaveCourse} loading={saving} icon={FiSave}>Save Changes</Button>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-dark-900 dark:text-white">Course Curriculum</h2>
              <Button variant="outline" size="sm" icon={FiPlus} onClick={addModule}>Add Module</Button>
            </div>
            <div className="space-y-3">
              {modules.map((mod) => (
                <div key={mod._id} className="glass-card rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-800/50">
                    <div className="flex items-center gap-3">
                      <FiMenu className="text-dark-400 cursor-move" />
                      <span className="font-medium text-dark-900 dark:text-white">{mod.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => addLesson(mod._id)} className="p-2 text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors"><FiPlus /></button>
                      <button onClick={() => setExpandedModule(expandedModule === mod._id ? null : mod._id)} className="p-2 text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
                        <FiChevronDown className={expandedModule === mod._id ? 'rotate-180' : ''} />
                      </button>
                      <button onClick={() => deleteModule(mod._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><FiTrash2 /></button>
                    </div>
                  </div>
                  {expandedModule === mod._id && (
                    <div className="p-4 space-y-2">
                      {mod.lessons?.map((lesson) => (
                        <div key={lesson._id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-50 dark:bg-dark-800/50">
                          <FiPlay className="text-primary-500 text-sm" />
                          <span className="text-sm text-dark-700 dark:text-dark-200 flex-1">{lesson.title}</span>
                          <FiFileText className="text-dark-400" />
                        </div>
                      ))}
                      {(!mod.lessons || mod.lessons.length === 0) && (
                        <p className="text-sm text-dark-400 text-center py-4">No lessons yet</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <Input label="Price ($)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
            <Button onClick={handleSaveCourse} loading={saving} icon={FiSave}>Save Pricing</Button>
          </div>
        )}
      </div>
    </div>
  );
}
