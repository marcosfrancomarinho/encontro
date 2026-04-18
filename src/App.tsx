import React, { useRef, useState, useEffect } from 'react';
import { FaHeart, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import Confetti from 'react-confetti';

export const App: React.FC = () => {
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const [accepted, setAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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

      const moveX = -dx * force * 3;
      const moveY = -dy * force * 3;

      btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    } else {
      btn.style.transform = `translate(0px, 0px)`;
    }
  };

  const handleAccept = () => {
    setAccepted(true);
    setShowConfetti(true);
  };

  const handleBack = () => {
    setAccepted(false);
    setShowConfetti(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-rose-100 via-red-100 to-pink-200 p-4"
    >
      {/* 🎉 Confete (fica até clicar em voltar) */}
      {showConfetti && (
        <Confetti
          width={size.width}
          height={size.height}
          numberOfPieces={350}
          recycle={true}
          gravity={0.25}
        />
      )}

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 text-center border border-white/40">

        {/* Header (esconde após aceitar) */}
        {!accepted && (
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-800">
              Oii {greeting()}, Geovanna
            </h1>

            <div className="flex gap-2 text-red-500 text-2xl animate-pulse">
              <FaHeart />
              <FaHeart />
              <FaHeart />
            </div>
          </div>
        )}

        {/* Conteúdo */}
        {!accepted && (
          <>
            <p className="text-lg font-medium text-gray-700">
              Quer sair comigo?
            </p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleAccept}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <FaCheck />
                Sim
              </button>

              <button
                ref={noButtonRef}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-2 rounded-xl shadow-md transition-transform duration-200 ease-out"
              >
                <FaTimes />
                Não
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
              <FaArrowRight className="text-gray-400" />
              Sem pressão... mas seria massa 😄.
            </p>
          </>
        )}

        {/* Sucesso */}
        {accepted && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="text-5xl animate-bounce">🎉</div>

            <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <FaCheck />
              Boa escolha!
            </h2>

            <p className="text-gray-700 font-medium">
              Muito bem! Você desbloqueou um encontro 😎
            </p>

            <button
              onClick={handleBack}
              className="mt-2 text-sm text-gray-500 underline hover:text-gray-700 transition"
            >
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};