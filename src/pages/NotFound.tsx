import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden perspective-1000">
      <div className="absolute inset-0 transform-style-preserve-3d">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-radial from-yellow-300 via-orange-400 to-red-600 rounded-full animate-pulse opacity-90 shadow-2xl transform-style-preserve-3d">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200 to-transparent rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-30 scale-150"></div>
        <div className="absolute inset-0 bg-orange-400 rounded-full blur-2xl opacity-20 scale-200"></div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-gray-600 rounded-full opacity-25" style={{ transform: 'translate(-50%, -50%) rotateX(10deg) rotateY(15deg)' }}>
        <div className="absolute w-3 h-3 bg-gray-400 rounded-full animate-spin origin-center shadow-lg" style={{ animationDuration: '8s', top: '-1.5px', left: '50%', transform: 'translateX(-50%) translateZ(8px)' }}></div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 border border-gray-600 rounded-full opacity-20" style={{ transform: 'translate(-50%, -50%) rotateX(15deg) rotateY(10deg)' }}>
        <div className="absolute w-4 h-4 bg-yellow-600 rounded-full animate-spin origin-center shadow-lg" style={{ animationDuration: '12s', top: '-2px', left: '50%', transform: 'translateX(-50%) translateZ(12px)' }}></div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-gray-600 rounded-full opacity-15" style={{ transform: 'translate(-50%, -50%) rotateX(20deg) rotateY(5deg)' }}>
        <div className="absolute w-5 h-5 bg-gradient-to-br from-blue-500 to-green-600 rounded-full animate-spin origin-center shadow-xl" style={{ animationDuration: '16s', top: '-2.5px', left: '50%', transform: 'translateX(-50%) translateZ(16px)' }}>
          <div className="absolute w-1.5 h-1.5 bg-gray-300 rounded-full animate-spin shadow-sm" style={{ animationDuration: '2s', top: '-8px', left: '50%', transform: 'translateX(-50%) translateZ(4px)' }}></div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-88 h-88 border border-gray-600 rounded-full opacity-12" style={{ transform: 'translate(-50%, -50%) rotateX(25deg) rotateY(20deg)' }}>
        <div className="absolute w-4 h-4 bg-red-600 rounded-full animate-spin origin-center shadow-lg" style={{ animationDuration: '24s', top: '-2px', left: '50%', transform: 'translateX(-50%) translateZ(20px)' }}></div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-104 h-104 border border-gray-600 rounded-full opacity-10" style={{ transform: 'translate(-50%, -50%) rotateX(30deg) rotateY(25deg)' }}>
        <div className="absolute w-10 h-10 bg-gradient-to-br from-orange-700 to-yellow-800 rounded-full animate-spin origin-center shadow-2xl" style={{ animationDuration: '40s', top: '-5px', left: '50%', transform: 'translateX(-50%) translateZ(24px)' }}>
          <div className="absolute inset-1 border border-orange-400 rounded-full opacity-50"></div>
          <div className="absolute inset-0 bg-orange-600 rounded-full blur-md opacity-20 scale-150"></div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-120 h-120 border border-gray-600 rounded-full opacity-8" style={{ transform: 'translate(-50%, -50%) rotateX(35deg) rotateY(30deg)' }}>
        <div className="absolute w-8 h-8 bg-gradient-to-br from-yellow-600 to-orange-700 rounded-full animate-spin origin-center shadow-xl" style={{ animationDuration: '60s', top: '-4px', left: '50%', transform: 'translateX(-50%) translateZ(28px)' }}></div>
        <div className="absolute inset-0 border-2 border-yellow-400 rounded-full opacity-70" style={{ transform: 'scale(2.2) rotateX(70deg)' }}></div>
        <div className="absolute inset-0 border border-yellow-300 rounded-full opacity-40" style={{ transform: 'scale(2.8) rotateX(70deg)' }}></div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-80 h-80" style={{ transform: 'translate(-50%, -50%) rotateX(20deg)' }}>
        <div className="absolute w-1.5 h-1.5 bg-gray-500 rounded-full animate-spin opacity-70 shadow-sm" style={{ animationDuration: '18s', top: '10px', left: '50%', transform: 'translateZ(6px)' }}></div>
        <div className="absolute w-1 h-1 bg-gray-400 rounded-full animate-spin opacity-50 shadow-sm" style={{ animationDuration: '22s', top: '30px', left: '60%', transform: 'translateZ(4px)' }}></div>
        <div className="absolute w-1.5 h-1.5 bg-gray-600 rounded-full animate-spin opacity-60 shadow-sm" style={{ animationDuration: '19s', top: '20px', left: '40%', transform: 'translateZ(8px)' }}></div>
        <div className="absolute w-1 h-1 bg-gray-500 rounded-full animate-spin opacity-40 shadow-sm" style={{ animationDuration: '25s', top: '5px', left: '70%', transform: 'translateZ(2px)' }}></div>
      </div>
      <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-white rounded-full opacity-90 animate-pulse shadow-sm" style={{ animationDuration: '3s', transform: 'translateZ(40px)' }}></div>
      <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse shadow-sm" style={{ animationDuration: '4s', transform: 'translateZ(30px)' }}></div>
      <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white rounded-full opacity-80 animate-pulse shadow-sm" style={{ animationDuration: '2s', transform: 'translateZ(50px)' }}></div>
      <div className="absolute bottom-10 right-10 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse shadow-sm" style={{ animationDuration: '5s', transform: 'translateZ(20px)' }}></div>
      <div className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-95 animate-pulse shadow-sm" style={{ animationDuration: '6s', transform: 'translateZ(60px)' }}></div>
      <div className="absolute top-60 right-1/4 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse shadow-sm" style={{ animationDuration: '3.5s', transform: 'translateZ(16px)' }}></div>
      <div className="absolute bottom-40 right-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-85 animate-pulse shadow-sm" style={{ animationDuration: '4.5s', transform: 'translateZ(44px)' }}></div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center text-white" style={{ transform: 'translate(-50%, -50%) translateZ(80px)' }}>
        <div className="mb-8">
          <h1 className="mb-6 text-8xl font-bold text-white drop-shadow-2xl" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)', transform: 'translateZ(20px)' }}>404</h1>
        </div>
        <h2 className="mb-6 text-3xl font-semibold text-gray-200 drop-shadow-lg" style={{ transform: 'translateZ(16px)' }}>Lost in Space</h2>
        <p className="mb-8 text-lg text-gray-400 max-w-md mx-auto drop-shadow-md" style={{ transform: 'translateZ(12px)' }}>
          The page you are looking for has drifted into the cosmic void.
        </p>
        <a 
          href="/" 
          className="inline-block px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-semibold border border-gray-600 shadow-2xl hover:shadow-3xl hover:scale-105"
          style={{ transform: 'translateZ(8px)' }}
        >
          Navigate Home
        </a>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotateX-10 { transform: rotateX(10deg); }
        .rotateX-15 { transform: rotateX(15deg); }
        .rotateX-20 { transform: rotateX(20deg); }
        .rotateX-25 { transform: rotateX(25deg); }
        .rotateX-30 { transform: rotateX(30deg); }
        .rotateX-35 { transform: rotateX(35deg); }
        .rotateX-70 { transform: rotateX(70deg); }
        .rotateY-5 { transform: rotateY(5deg); }
        .rotateY-10 { transform: rotateY(10deg); }
        .rotateY-15 { transform: rotateY(15deg); }
        .rotateY-20 { transform: rotateY(20deg); }
        .rotateY-25 { transform: rotateY(25deg); }
        .rotateY-30 { transform: rotateY(30deg); }
        .translateZ-1 { transform: translateZ(2px); }
        .translateZ-2 { transform: translateZ(4px); }
        .translateZ-3 { transform: translateZ(6px); }
        .translateZ-4 { transform: translateZ(8px); }
        .translateZ-6 { transform: translateZ(12px); }
        .translateZ-8 { transform: translateZ(16px); }
        .translateZ-10 { transform: translateZ(20px); }
        .translateZ-12 { transform: translateZ(24px); }
        .translateZ-14 { transform: translateZ(28px); }
        .translateZ-15 { transform: translateZ(30px); }
        .translateZ-20 { transform: translateZ(40px); }
        .translateZ-22 { transform: translateZ(44px); }
        .translateZ-25 { transform: translateZ(50px); }
        .translateZ-30 { transform: translateZ(60px); }
        .translateZ-40 { transform: translateZ(80px); }
        .w-88 { width: 22rem; }
        .h-88 { height: 22rem; }
        .w-104 { width: 26rem; }
        .h-104 { height: 26rem; }
        .w-120 { width: 30rem; }
        .h-120 { height: 30rem; }
        `
      }} />
      </div>
    </div>
  );
};

export default NotFound;
