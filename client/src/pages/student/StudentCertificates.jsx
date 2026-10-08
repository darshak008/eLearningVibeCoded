import { useState, useEffect } from 'react';
import { FiAward, FiDownload, FiShare2 } from 'react-icons/fi';
import { certificateAPI } from '../../services/api';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateAPI.getMy()
      .then((res) => setCertificates(res.data.certificates))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">My Certificates</h1>
        <p className="text-dark-500 dark:text-dark-400 mb-6">{certificates.length} certificates earned</p>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : certificates.length === 0 ? (
          <EmptyState icon={<FiAward />} title="No certificates yet" description="Complete courses to earn certificates" action={<a href="/courses" className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold">Start Learning</a>} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert._id} className="glass-card rounded-2xl p-6 card-hover text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4">
                  <FiAward className="text-white text-2xl" />
                </div>
                <h3 className="font-semibold text-dark-900 dark:text-white mb-1">{cert.courseName}</h3>
                <p className="text-sm text-dark-500 mb-4">Completed on {new Date(cert.completionDate).toLocaleDateString()}</p>
                <p className="text-xs text-dark-400 mb-4 font-mono">ID: {cert.certificateId}</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => toast.success('Certificate downloaded')} className="flex items-center gap-1 px-4 py-2 glass rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"><FiDownload /> Download</button>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/certificates/verify/${cert.certificateId}`); toast.success('Link copied!'); }} className="flex items-center gap-1 px-4 py-2 glass rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"><FiShare2 /> Share</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
