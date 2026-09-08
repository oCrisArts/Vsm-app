import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Drawer } from '@mui/material';
import { Sparkles, BookOpen, TrendingUp, Calendar, Library } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { Marketplace } from './components/Marketplace';
import { Evolucao } from './components/Evolucao';
import { Agenda } from './components/Agenda';
import { ArsenalNew } from './components/ArsenalNew';
import { ProfileNew } from './components/ProfileNew';
import { CourseLanding } from './components/CourseLanding';
import { Classroom } from './components/Classroom';
import { StudyMode } from './components/StudyMode';
import { AppHeader } from './components/AppHeader';

type AppStage = 'login' | 'onboarding' | 'app';
type View = 'home' | 'marketplace' | 'evolucao' | 'agenda' | 'consultar' | 'course-landing' | 'classroom' | 'study-mode';

export default function App() {
  const [stage, setStage] = useState<AppStage>('login');
  const [activeTab, setActiveTab] = useState(0);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);

  /* ── Auth ── */
  const handleLogin = () => setStage('onboarding');
  const handleOnboardingDone = () => setStage('app');

  /* ── Nav ── */
  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
    const views: View[] = ['home', 'marketplace', 'evolucao', 'agenda', 'consultar'];
    setCurrentView(views[newValue]);
  };

  /* ── Course flow ── */
  const handleNavigateToCourse = (courseId: number) => {
    setSelectedCourseId(courseId);
    setCurrentView('course-landing');
  };
  const handleEnrollCourse = (courseId: number) => {
    setEnrolledCourses(prev => [...prev, courseId]);
    setCurrentView('classroom');
  };
  const handleOpenClassroom = (courseId: number) => {
    setSelectedCourseId(courseId);
    setCurrentView('classroom');
  };
  const handleStartLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setCurrentView('study-mode');
  };
  const handleBackFromCourse = () => {
    const tabViews: View[] = ['home', 'marketplace', 'evolucao', 'agenda', 'consultar'];
    setCurrentView(tabViews[activeTab] ?? 'home');
    setSelectedCourseId(null);
  };
  const handleBackFromClassroom = () => {
    setCurrentView('evolucao');
    setActiveTab(2);
  };
  const handleCloseStudyMode = () => {
    setCurrentView('classroom');
    setSelectedLessonId(null);
  };

  const handleNavigateToAgenda = () => { setActiveTab(3); setCurrentView('agenda'); };
  const handleNavigateToArsenal = () => { setActiveTab(4); setCurrentView('consultar'); };

  const isFullscreen = currentView === 'study-mode';
  const isSubView = currentView === 'course-landing' || currentView === 'classroom';
  const showChrome = !isFullscreen;
  const HEADER_H = 56;
  const NAV_H   = 64;

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigateToCourse={handleNavigateToCourse} onNavigateToAgenda={handleNavigateToAgenda} />;
      case 'marketplace':
        return <Marketplace onSelectCourse={handleNavigateToCourse} />;
      case 'evolucao':
        return <Evolucao onSelectCourse={handleOpenClassroom} />;
      case 'agenda':
        return <Agenda />;
      case 'consultar':
        return <ArsenalNew />;
      case 'course-landing':
        return selectedCourseId ? (
          <CourseLanding courseId={selectedCourseId} onBack={handleBackFromCourse}
            onEnroll={handleEnrollCourse} isEnrolled={enrolledCourses.includes(selectedCourseId)} onOpenClassroom={handleOpenClassroom} />
        ) : null;
      case 'classroom':
        return selectedCourseId ? (
          <Classroom courseId={selectedCourseId} onBack={handleBackFromClassroom} onStartLesson={handleStartLesson} />
        ) : null;
      case 'study-mode':
        return selectedLessonId ? (
          <StudyMode lessonId={selectedLessonId} onClose={handleCloseStudyMode} />
        ) : null;
      default:
        return <Home onNavigateToCourse={handleNavigateToCourse} onNavigateToAgenda={handleNavigateToAgenda} />;
    }
  };

  /* ── LOGIN ── */
  if (stage === 'login') {
    return (
      <div className="min-h-screen bg-black dark">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  /* ── ONBOARDING ── */
  if (stage === 'onboarding') {
    return (
      <div className="min-h-screen bg-black dark">
        <Onboarding onComplete={handleOnboardingDone} />
      </div>
    );
  }

  /* ── MAIN APP ── */
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen dark"
        style={{ backgroundColor: '#121212' }}
      >
        {/* Global Header */}
        {showChrome && !isSubView && (
          <AppHeader onOpenProfile={() => setProfileOpen(true)} />
        )}

        {/* Content */}
        <div style={{ paddingTop: showChrome && !isSubView ? HEADER_H : 0, paddingBottom: showChrome ? NAV_H : 0 }}>
          {renderContent()}
        </div>

        {/* Bottom Nav */}
        {showChrome && (
          <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,
                bgcolor: '#121212',
                borderTop: '1px solid #2A2A2A',
                zIndex: 1000,
              }}
            elevation={8}
          >
            <BottomNavigation
              value={isSubView ? -1 : activeTab}
              onChange={(_, v) => handleTabChange(v)}
              showLabels
              sx={{
                bgcolor: '#121212', height: '64px',
                '& .MuiBottomNavigationAction-root': { color: '#666666', minWidth: '56px', padding: '6px 4px', '&.Mui-selected': { color: '#1E40AF' } },
                '& .MuiBottomNavigationAction-label': {
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '9px', fontWeight: 500, marginTop: '3px', opacity: 1, letterSpacing: '0.04em',
                  '&.Mui-selected': { fontSize: '9px' },
                },
              }}
            >
              <BottomNavigationAction label="Iniciar" icon={<Sparkles size={22} />} />
              <BottomNavigationAction label="Aprender" icon={<BookOpen size={22} />} />
              <BottomNavigationAction label="Evoluir" icon={<TrendingUp size={22} />} />
              <BottomNavigationAction label="Conectar" icon={<Calendar size={22} />} />
              <BottomNavigationAction label="Consultar" icon={<Library size={22} />} />
            </BottomNavigation>
          </Paper>
        )}

        {/* Profile Drawer */}
        <Drawer
          anchor="bottom"
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          PaperProps={{
            sx: { bgcolor: 'transparent', maxHeight: '92vh', borderRadius: '16px 16px 0 0', overflow: 'hidden' },
          }}
        >
          <div style={{ backgroundColor: '#1E1E1E', borderTop: '1px solid #2A2A2A', borderRadius: '16px 16px 0 0', overflowY: 'auto', maxHeight: '92vh' }}>
            <ProfileNew onClose={() => setProfileOpen(false)} />
          </div>
        </Drawer>
      </motion.div>
    </AnimatePresence>
  );
}