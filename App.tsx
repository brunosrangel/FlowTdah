import React from 'react';
import { GoogleApiProvider } from './context/GoogleApiProvider';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginScreen from './screens/LoginScreen';
import PomodoroScreen from './screens/PomodoroScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import CalendarScreen from './screens/CalendarScreen';
import SettingsScreen from './screens/SettingsScreen';
import HomeScreen from './screens/HomeScreen';
import BottomNavBar from './components/BottomNavBar';
import VirtualAssistant from './components/VirtualAssistant';
import Toast from './components/Toast';

const AppContent = () => {
    const {
        user,
        pomodoroTask,
        currentScreen,
        editingTask,
        isAssistantOpen,
        toast,
        handleLogin,
        handleCompletePomodoroTask,
        setPomodoroTask,
        handleNavigate,
        handleEditTask,
        setIsAssistantOpen,
        setToast,
        tasks,
        pomodoroSettings,
        theme,
        userActions,
        taskActions
    } = useAppContext();

    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    if (pomodoroTask) {
        return (
            <PomodoroScreen
                task={pomodoroTask}
                settings={pomodoroSettings}
                onComplete={handleCompletePomodoroTask}
                onExit={() => setPomodoroTask(null)}
            />
        );
    }

    const renderScreen = () => {
        switch (currentScreen) {
            case 'add':
                return (
                    <AddTaskScreen
                        onBack={() => handleNavigate('home')}
                        editingTask={editingTask}
                    />
                );
            case 'calendar':
                return <CalendarScreen tasks={tasks} onEdit={handleEditTask} />;
            case 'settings':
                return <SettingsScreen />;
            case 'home':
            default:
                return (
                    <HomeScreen />
                );
        }
    };

    return (
        <>
            {renderScreen()}
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
            {isAssistantOpen && <VirtualAssistant onAddTask={taskActions.addTask} onClose={() => setIsAssistantOpen(false)} />}
            {currentScreen !== 'add' && (
                <>
                    <button className="assistant-fab" onClick={() => setIsAssistantOpen(true)} aria-label="Abrir assistente virtual">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"></path></svg>
                    </button>
                    <BottomNavBar currentScreen={currentScreen} onNavigate={handleNavigate} />
                </>
            )}
        </>
    );
};


const App = () => (
    <GoogleApiProvider>
        <AppProvider>
            <AppContent />
        </AppProvider>
    </GoogleApiProvider>
);

export default App;
