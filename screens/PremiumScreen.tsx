
import React from 'react';

const PremiumFeature: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <li className="flex items-start space-x-3">
        <div className="text-2xl">{icon}</div>
        <div>
            <p className="font-semibold text-text-primary">{title}</p>
            <p className="text-sm text-text-secondary">{description}</p>
        </div>
    </li>
);


const PremiumScreen: React.FC = () => {
    
    const handlePurchase = () => {
        alert("Obrigado por apoiar o FocusFlow! 💪");
    };
    
    return (
        <div className="p-4 animate-fade-in-up flex flex-col justify-center items-center h-screen">
             <div className="w-full max-w-sm text-center">
                <div className="text-5xl mb-4">💛</div>
                <h1 className="text-2xl font-bold text-text-primary">FocusFlow Premium</h1>
                <p className="text-text-secondary mt-2 mb-6">Desbloqueie todo o potencial do FocusFlow e turbine sua produtividade.</p>

                <div className="bg-white p-6 rounded-2xl shadow-sm text-left mb-8">
                     <ul className="space-y-4">
                        <PremiumFeature icon="🚫" title="Sem Anúncios" description="Uma experiência totalmente livre de distrações." />
                        <PremiumFeature icon="🎨" title="Novos Temas" description="Personalize o app com cores e estilos exclusivos." />
                        <PremiumFeature icon="📊" title="Relatórios Avançados" description="Mergulhe fundo nas suas métricas de produtividade." />
                     </ul>
                </div>
                
                <button 
                    onClick={handlePurchase}
                    className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg shadow-primary/30"
                >
                    Obter Premium - R$ 9,90
                </button>
             </div>
        </div>
    );
};

export default PremiumScreen;
