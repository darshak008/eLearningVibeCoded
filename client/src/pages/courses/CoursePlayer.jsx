import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlay, FiPause, FiMaximize2, FiMinimize2, FiChevronLeft,
  FiChevronRight, FiCheckCircle, FiCircle, FiDownload, FiFileText,
  FiMessageCircle, FiBookmark, FiEdit3, FiMonitor, FiVolume2,
  FiSkipBack, FiSkipForward, FiSettings,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { enrollmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CoursePlayer() {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const allLessons = enrollment?.course?.modules?.flatMap(m => m.lessons) || [];
  const currentIndex = allLessons.findIndex(l => l._id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const completedIds = enrollment?.completedLessons?.map(id => id.toString()) || [];

  useEffect(() => {
    loadEnrollment();
  }, []);

  const loadEnrollment = async () => {
    try {
      const enrollments = await enrollmentAPI.getMy();
      const enroll = enrollments.data.enrollments.find(e => e.course?.slug === slug);
      if (enroll) {
        const detail = await enrollmentAPI.get(enroll._id);
        setEnrollment(detail.data.enrollment);
        const lesson = allLessons.find(l => l._id === lessonId);
        setCurrentLesson(lesson || detail.data.enrollment.course?.modules?.[0]?.lessons?.[0]);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changeSpeed = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleComplete = async (lessonId, completed) => {
    if (!enrollment) return;
    try {
      await enrollmentAPI.updateProgress(enrollment._id, { lessonId, completed });
      loadEnrollment();
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const navigateLesson = (lesson) => {
    if (lesson) navigate(`/courses/${slug}/learn/${lesson._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl font-semibold text-dark-200">You are not enrolled in this course</p>
        <button onClick={() => navigate(`/courses/${slug}`)} className="px-6 py-3 bg-primary-500 text-white rounded-xl">View Course</button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-950 pt-16">
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 flex flex-col ${showSidebar ? 'lg:mr-96' : ''} transition-all duration-300`}>
          <div className="relative bg-black flex-1 flex items-center justify-center">
            {currentLesson?.videoUrl ? (
              <video
                ref={videoRef}
                src={currentLesson.videoUrl}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls
              />
            ) : (
              <div className="text-center">
                <FiMonitor className="text-6xl text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">No video available for this lesson</p>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => navigateLesson(prevLesson)} disabled={!prevLesson} className="p-2 text-white/70 hover:text-white disabled:opacity-30">
                    <FiSkipBack />
                  </button>
                  <button onClick={togglePlay} className="p-3 bg-primary-500 rounded-full text-white hover:bg-primary-600">
                    {isPlaying ? <FiPause /> : <FiPlay />}
                  </button>
                  <button onClick={() => navigateLesson(nextLesson)} disabled={!nextLesson} className="p-2 text-white/70 hover:text-white disabled:opacity-30">
                    <FiSkipForward />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => changeSpeed(playbackRate === 2 ? 0.5 : playbackRate + 0.25)} className="px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white bg-white/10 rounded-lg">
                    {playbackRate}x
                  </button>
                  <button onClick={toggleFullscreen} className="p-2 text-white/70 hover:text-white">
                    {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-900 border-t border-dark-800 p-4">
            <div className="flex gap-2">
              {['overview', 'notes', 'resources', 'qa'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg capitalize ${
                    activeTab === tab ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-dark-900 p-4">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{currentLesson?.title}</h2>
                <p className="text-dark-400">{currentLesson?.description}</p>
              </div>
            )}
            {activeTab === 'notes' && (
              <div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write your notes here..."
                  className="w-full h-32 p-4 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                <button className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm">Save Note</button>
              </div>
            )}
            {activeTab === 'resources' && (
              <div className="space-y-2">
                {currentLesson?.resources?.map((res, i) => (
                  <a key={i} href={res.url} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors">
                    <FiFileText className="text-primary-500" />
                    <span className="text-sm text-dark-200">{res.title}</span>
                  </a>
                ))}
                {(!currentLesson?.resources || currentLesson.resources.length === 0) && (
                  <p className="text-dark-500">No resources for this lesson</p>
                )}
              </div>
            )}
          </div>
        </div>

        {showSidebar && (
          <div className="fixed right-0 top-16 bottom-0 w-96 bg-dark-900 border-l border-dark-800 overflow-y-auto">
            <div className="p-4 border-b border-dark-800 flex items-center justify-between">
              <h2 className="font-semibold text-white">{enrollment.course?.title}</h2>
              <button onClick={() => setShowSidebar(false)} className="text-dark-400 hover:text-white">
                <FiChevronRight />
              </button>
            </div>
            <div className="px-3 py-2 text-sm text-dark-400 border-b border-dark-800">
              {enrollment.progress}% complete
              <div className="h-1.5 bg-dark-700 rounded-full mt-1">
                <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
              </div>
            </div>
            <div className="py-2">
              {enrollment.course?.modules?.map((mod) => (
                <div key={mod._id}>
                  <div className="px-4 py-2 text-xs font-medium text-dark-400 uppercase tracking-wider">
                    {mod.title}
                  </div>
                  {mod.lessons?.map((lesson) => {
                    const isCompleted = completedIds.includes(lesson._id);
                    const isCurrent = lesson._id === lessonId;
                    return (
                      <button
                        key={lesson._id}
                        onClick={() => navigateLesson(lesson)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          isCurrent ? 'bg-primary-500/10 border-l-2 border-primary-500' : 'hover:bg-dark-800'
                        }`}
                      >
                        {isCompleted ? (
                          <FiCheckCircle className="text-success-500 flex-shrink-0" />
                        ) : (
                          <FiCircle className={`text-dark-500 flex-shrink-0 ${isCurrent ? 'text-primary-500' : ''}`} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${isCurrent ? 'text-primary-400 font-medium' : 'text-dark-300'}`}>{lesson.title}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleComplete(lesson._id, !isCompleted); }}
                          className={`text-xs px-2 py-1 rounded ${isCompleted ? 'text-success-500' : 'text-dark-500 hover:text-white'}`}
                        >
                          {isCompleted ? 'Done' : 'Mark'}
                        </button>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
