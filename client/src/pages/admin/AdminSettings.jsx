import { FiSettings, FiSave } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const handleSave = () => toast.success('Settings saved (coming soon)');

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Platform Settings</h1>
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <Input label="Platform Name" defaultValue="LearnHub" />
          <Input label="Support Email" defaultValue="support@learnhub.com" />
          <Input label="Commission Rate (%)" type="number" defaultValue="20" />
          <Button onClick={handleSave} icon={FiSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
