import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';

const LoginPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [focus, setFocus] = useState(null); 
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);

  // Global Mouse Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = () => {
    if (!emailInput || !passwordInput) {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    } else {
      alert("Login Success!");
    }
  };

  /**
   * 👁️ EYE BOUNDARY LOGIC
   * STRICT LIMIT: Keeps eye inside the circle (Max 7px movement)
   */
  const getPupilStyle = () => {
    let x = 0;
    let y = 0;
    const LIMIT = 7; 

    // === 1. PASSWORD FOCUS ===
    if (focus === 'password') {
      if (showPassword) {
        // Revealed -> Snap Away Left/Up
        x = -LIMIT; 
        y = -LIMIT; 
      } else {
        // Hidden -> Look at Input (Right & Down)
        const typingScan = Math.min(passwordInput.length, 10) * 0.5; 
        x = Math.min(LIMIT, 4 + typingScan); 
        y = 3; 
      }
    } 
    // === 2. EMAIL FOCUS ===
    else if (focus === 'email') {
      // Look at Email (Right & Up)
      const typingScan = Math.min(emailInput.length, 10) * 0.5;
      x = Math.min(LIMIT, 4 + typingScan);
      y = -4; 
    } 
    // === 3. IDLE (Follow Mouse) ===
    else {
      x = Math.max(-LIMIT, Math.min(LIMIT, (mousePos.x * (LIMIT * 2)) - LIMIT));
      y = Math.max(-LIMIT, Math.min(LIMIT, (mousePos.y * (LIMIT * 2)) - LIMIT));
    }

    return { 
      transform: `translate(${x}px, ${y}px)`,
      transition: 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
    };
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f4f6] flex items-center justify-center p-4 font-sans text-slate-800">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-15px) rotate(-5deg); }
          40% { transform: translateX(15px) rotate(5deg); }
          60% { transform: translateX(-8px) rotate(-2deg); }
          80% { transform: translateX(8px) rotate(2deg); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

      <div className="bg-white w-full max-w-5xl rounded-[30px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* === ILLUSTRATION SECTION === */}
        <div className="w-full md:w-1/2 bg-[#f3f4f6] relative overflow-hidden flex items-end justify-center min-h-[300px] md:min-h-auto">
          
          <div className={`relative w-full h-full flex justify-center items-end pb-0 transition-transform ${isError ? 'animate-shake' : ''}`}>
            
            {/* ⚫ 1. BLACK CHARACTER (Background) */}
            <div className="relative z-10 bottom-0 mx-[-15px]">
               <div className="w-28 h-80 bg-black rounded-t-[60px] relative shadow-2xl">
                  {/* Eyes */}
                  <div className="absolute top-16 left-6 flex gap-5">
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center overflow-hidden relative shadow-inner">
                      <div className="w-3 h-3 bg-black rounded-full" style={getPupilStyle()}></div>
                    </div>
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center overflow-hidden relative shadow-inner">
                      <div className="w-3 h-3 bg-black rounded-full" style={getPupilStyle()}></div>
                    </div>
                  </div>
               </div>
            </div>

            {/* 🟣 2. PURPLE CHARACTER (Foreground) */}
            <div className="absolute bottom-0 left-[18%] z-30">
               <div className="w-24 h-24 bg-[#6366f1] rounded-full shadow-lg relative flex items-center justify-center border-4 border-[#f3f4f6]">
                  {/* Eyes */}
                  <div className="absolute top-6 flex gap-2">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/5">
                       <div className="w-2 h-2 bg-black rounded-full" style={getPupilStyle()}></div>
                    </div>
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/5">
                       <div className="w-2 h-2 bg-black rounded-full" style={getPupilStyle()}></div>
                    </div>
                  </div>
                  
                  {/* === FIXED MOUTH: Solid Black === */}
                  <div className="absolute top-14 w-4 h-2 border-b-2 border-black rounded-full"></div>
                  
               </div>
            </div>

            {/* 🟠 3. ORANGE CHARACTER (Foreground) */}
            <div className="relative z-40 bottom-0 -ml-8">
               <div className="w-32 h-32 bg-[#ff6b4a] rounded-full relative flex items-center justify-center shadow-lg border-4 border-[#f3f4f6]">
                  <div className="absolute top-8 flex flex-col items-center gap-2">
                     <div className="flex gap-6">
                        <div className="w-2 h-2 bg-black rounded-full" style={getPupilStyle()}></div>
                        <div className="w-2 h-2 bg-black rounded-full" style={getPupilStyle()}></div>
                     </div>
                     {/* Mouth */}
                     <div className={`bg-black rounded-full transition-all duration-300 
                        ${showPassword && focus === 'password' ? 'w-3 h-3' : 'w-4 h-2 border-b-2 border-transparent'}
                        ${!showPassword ? 'border-black' : ''}
                        ${isError ? 'rotate-180 mt-1' : ''}
                     `}></div>
                  </div>
               </div>
            </div>

            {/* 🟡 4. YELLOW CHARACTER (Foreground) */}
            <div className="relative z-50 bottom-0 -ml-6">
               <div className="w-24 h-24 bg-[#fbbf24] rounded-t-full rounded-b-xl relative shadow-md border-b-0 border-4 border-[#f3f4f6]">
                   <div className="absolute top-8 left-7 flex flex-col items-center gap-2">
                        <div className="flex gap-4">
                            <div className="w-2 h-2 bg-black rounded-full" style={getPupilStyle()}></div>
                            <div className="w-2 h-2 bg-black rounded-full" style={getPupilStyle()}></div>
                        </div>
                        <div className="w-2 h-2 bg-black rounded-full opacity-50"></div>
                   </div>
               </div>
            </div>

          </div>
        </div>

        {/* === FORM SECTION === */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center relative">
          
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-500 text-sm mb-8">Please enter your details</p>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  placeholder="anna@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onFocus={() => setFocus('email')}
                  onBlur={() => setFocus(null)}
                  className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all duration-200
                      ${isError ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-black'}`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onFocus={() => setFocus('password')}
                    onBlur={() => setFocus(null)}
                    className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all duration-200 pr-10
                         ${isError ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-black'}`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {focus === 'password' && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-2 animate-pulse">
                        {showPassword 
                           ? "🙈 Ops! We are not looking!" 
                           : "🧐 Checking your password strength..."}
                    </p>
                )}
              </div>

              <button 
                onClick={handleLogin}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors active:scale-[0.98]">
                Log In
              </button>

              <button className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Log In with Google
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Don't have an account? <a href="#" className="font-medium text-black hover:underline">Sign Up</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;