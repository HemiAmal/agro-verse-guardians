import React from 'react';
import { useNavigate } from 'react-router-dom';
import gamebg from "@/assets/gamedivImage.png";

const GameIntroPanel: React.FC = () => {
    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate('/game-map'); // Replace with your desired route
    };

    return (
        <div className="fixed bottom-5 right-5 bg-cover p-5 rounded-xl border border-gray-700 shadow-2xl z-[1000] min-w-[200px]">
            <div className="inset-0 bg-cover bg-center " style={{ backgroundImage: `url(${gamebg})` }}>
            </div>
            <h3 className="text-white m-0 mb-4 text-lg font-bold">
                Ready to Start?
                </h3>
                <p className="text-gray-300 m-0 mb-5 text-sm leading-relaxed">
                Enter the farming simulation and manage your crops effectively.
                </p>
                <div 
                className="px-6 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg cursor-pointer text-base font-bold text-center transition-colors duration-300 flex items-center justify-center gap-2 hover:bg-gray-700"
                onClick={handleStartGame}
                >
                Start Game →
                </div>
        </div>
    );
};

export default GameIntroPanel;