import React, { useRef, useState, useEffect } from 'react';
import { FaHeart, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import Confetti from 'react-confetti';

export const App: React.FC = () => {
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const [accepted, setAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [opened, setOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const greeting = (): string => {
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 12) return 'Bom dia';
    if (hours >= 12 && hours < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const btn = noButtonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const triggerDistance = 170;

    if (distance < triggerDistance) {
      const force = (triggerDistance - distance) / triggerDistance;
      btn.style.transform = `translate(${-dx * force * 3}px, ${-dy * force * 3}px)`;
    } else {
      btn.style.transform = `translate(0px, 0px)`;
    }
  };

  const handleOpen = () => {
    setOpened(true);

    // espera a animação terminar
    setTimeout(() => {
      setShowContent(true);
    }, 600);
  };

  const handleAccept = async () => {
    setAccepted(true);
    setShowConfetti(true);

    try {
      await fetch('https://encontro-backend-aysb.onrender.com/notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'marcosmarinho19998@gmail.com', subject: 'marcosmarinho19998@gmail.com' }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => {
    setAccepted(false);
    setShowConfetti(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className='min-h-screen flex items-center justify-center bg-linear-to-br from-rose-100 via-red-100 to-pink-200 p-4'
    >
      {showConfetti && <Confetti width={size.width} height={size.height} numberOfPieces={350} recycle gravity={0.25} />}

      {/* ✉️ ENVELOPE */}
      {!showContent && (
        <div
          onClick={handleOpen}
          className='cursor-pointer relative w-full max-w-md h-64 flex items-center justify-center perspective'
        >
          {/* Base */}
          <div className='absolute inset-0 bg-[#f3d9c9] rounded-xl shadow-2xl border border-[#e5c3ad]' />

          {/* Sombra */}
          <div className='absolute inset-0 rounded-xl shadow-inner' />

          {/* Aba animada */}
          <div
            className={`absolute top-0 left-0 w-full h-1/2 bg-[#eac7b0] clip-envelope transition-transform duration-700 origin-top ${
              opened ? 'rotate-x-180' : ''
            }`}
          />

          {/* Dobras */}
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute bottom-0 left-0 w-1/2 h-full border-r border-[#e5c3ad] clip-left' />
            <div className='absolute bottom-0 right-0 w-1/2 h-full border-l border-[#e5c3ad] clip-right' />
          </div>

          {/* Selo */}
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-400 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md text-lg'>
            💌
          </div>

          {/* Texto */}
          <div className='absolute bottom-3 text-sm text-gray-700 font-medium'>Toque para abrir</div>
        </div>
      )}

      {/* 💌 CONTEÚDO */}
      {showContent && (
        <div className='w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 text-center border border-white/40 animate-fade-in'>
          {!accepted && (
            <div className='flex flex-col items-center gap-2'>
              <h1 className='text-2xl font-semibold text-gray-800'>Oii {greeting()}, Geovanna</h1>

              <div className='flex gap-2 text-red-500 text-2xl animate-pulse'>
                <FaHeart />
                <FaHeart />
                <FaHeart />
              </div>
            </div>
          )}

          {!accepted && (
            <>
              <p className='text-lg font-medium text-gray-700'>Gostaria de sair comigo?</p>

              <div className='flex gap-4 mt-4'>
                <button
                  onClick={handleAccept}
                  className='flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md hover:scale-110 active:scale-95 transition-all duration-200'
                >
                  <FaCheck />
                  Sim
                </button>

                <button
                  ref={noButtonRef}
                  className='flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-2 rounded-xl shadow-md transition-transform duration-200 ease-out'
                >
                  <FaTimes />
                  Não
                </button>
              </div>

              <p className='text-sm text-gray-500 mt-3 flex items-center gap-2'>
                <FaArrowRight />
                Sem pressão... mas seria massa 😄.
              </p>
            </>
          )}

          {accepted && (
            <div className='flex flex-col items-center gap-4'>
              <div className='text-5xl animate-bounce'>🎉</div>

              <h2 className='text-2xl font-bold text-green-600 flex items-center gap-2'>
                <FaCheck />
                Boa escolha!
              </h2>

              <p className='text-gray-700 font-medium'>Muito bem! Você desbloqueou um encontro 😎</p>

              <button onClick={handleBack} className='mt-2 text-sm text-gray-500 underline'>
                Voltar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
