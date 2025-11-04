import React from 'react';
import { PomodoroSettings } from '../types/types';
import { useAppContext } from '../context/AppContext';
import { useGoogleApi } from '../context/GoogleApiProvider';

const SettingsScreen = () => {
    const { user, userActions, pomodoroSettings, setPomodoroSettings, theme, setTheme } = useAppContext();
    const { isSignedIn, signIn, signOut, profile } = useGoogleApi();
    
    const handleConnectClick = () => {
        if (!user.isPremium) {
            userActions.upgrade();
        } else {
            signIn();
        }
    };
    
    const handleToggleTheme = () => {
        setTheme((prevTheme: string) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleSettingChange = (field: keyof PomodoroSettings, value: string) => {
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue) && numericValue > 0) {
            setPomodoroSettings({
                ...pomodoroSettings,
                [field]: numericValue
            });
        }
    };

    return (
        <div className="screen">
            <h2>Perfil & Configurações</h2>
            
            <div className="setting-section">
                 <div className="setting-item">
                    <span>Logado como <strong>{user.name}</strong></span>
                    <span className={`premium-badge ${user.isPremium ? '' : 'free'}`}>
                        {user.isPremium ? 'Premium' : 'Gratuito'}
                    </span>
                 </div>
                 <div className="setting-item">
                    <span>Tema Escuro</span>
                    <div className="theme-switch-wrapper">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        <label className="theme-switch" htmlFor="theme-toggle">
                            <input type="checkbox" id="theme-toggle" onChange={handleToggleTheme} checked={theme === 'dark'} />
                            <span className="slider"></span>
                        </label>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </div>
                 </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginTop: '32px' }}>Pomodoro</h3>
            <div className="setting-section">
                <div className="pomodoro-setting-item">
                    <label htmlFor="focusDuration">Duração do Foco (minutos)</label>
                    <input type="number" id="focusDuration" value={pomodoroSettings.focusDuration} onChange={(e) => handleSettingChange('focusDuration', e.target.value)} />
                </div>
                 <div className="pomodoro-setting-item">
                    <label htmlFor="shortBreakDuration">Pausa Curta (minutos)</label>
                    <input type="number" id="shortBreakDuration" value={pomodoroSettings.shortBreakDuration} onChange={(e) => handleSettingChange('shortBreakDuration', e.target.value)} />
                </div>
                 <div className="pomodoro-setting-item">
                    <label htmlFor="longBreakDuration">Pausa Longa (minutos)</label>
                    <input type="number" id="longBreakDuration" value={pomodoroSettings.longBreakDuration} onChange={(e) => handleSettingChange('longBreakDuration', e.target.value)} />
                </div>
                 <div className="pomodoro-setting-item">
                    <label htmlFor="cycles">Ciclos até a Pausa Longa</label>
                    <input type="number" id="cycles" value={pomodoroSettings.cycles} onChange={(e) => handleSettingChange('cycles', e.target.value)} />
                </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginTop: '32px' }}>Integrações</h3>
             <div className="setting-section">
                <div className="setting-item">
                     <span>Google Calendar ✨ { !user.isPremium && <span className="premium-badge">Premium</span>}</span>
                     {isSignedIn && profile ? (
                        <div className="google-user-info">
                            <img src={profile.getImageUrl()} alt="User"/>
                            <button className="btn-secondary" onClick={signOut}>Desconectar</button>
                        </div>
                     ) : (
                        <button className="btn-google-calendar" onClick={handleConnectClick}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            Conectar
                        </button>
                     )}
                </div>
            </div>

            {!user.isPremium && (
                <div className="card premium-card">
                    <h3>✨ Desbloqueie o FocusFlow Premium</h3>
                    <p>Aumente sua produtividade com recursos exclusivos.</p>
                    <ul>
                        <li>Sub-tarefas com IA</li>
                        <li>Sincronização com Google Calendar</li>
                        <li>Experiência sem anúncios</li>
                    </ul>
                    <button className="btn-secondary" onClick={userActions.upgrade} style={{width: '100%', backgroundColor: 'white', color: '#333'}}>
                        Atualizar Agora
                    </button>
                </div>
            )}

            <button onClick={userActions.logout} className="btn btn-secondary" style={{ width: '100%', marginTop: '20px' }}>
                Sair
            </button>
        </div>
    );
};

export default SettingsScreen;
