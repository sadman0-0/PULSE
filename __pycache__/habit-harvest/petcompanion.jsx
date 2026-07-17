import React, { useState, useEffect } from 'react';

type EmotionState = 'happy' | 'neutral' | 'sad' | 'very_sad';

interface PetCompanionProps {
    isActive?: boolean;
    inactiveMinutes?: number;
}

/**
 * PetCompanion Component
 * 
 * Interactive 3D dog pet that responds to user activity
 * - Shows happy emotions when exercises are completed
 * - Shows sad emotions during inactivity
 * - Features celebration particles and emotion indicators
 * 
 * Usage in React:
 * import PetCompanion from './PetCompanion';
 * 
 * <PetCompanion isActive={userCompletedHabits} inactiveMinutes={minutesSinceLastActivity} />
 */
export default function PetCompanion({ isActive = true, inactiveMinutes = 0 }: PetCompanionProps) {
    const [emotion, setEmotion] = useState<EmotionState>('happy');
    const [particles, setParticles] = useState<number[]>([]);

    useEffect(() => {
        if (isActive) {
            setEmotion('happy');
            // Create 8 celebration particles
            setParticles(Array.from({ length: 8 }, (_, i) => i));
        } else if (inactiveMinutes > 120) {
            setEmotion('very_sad');
            setParticles([]);
        } else if (inactiveMinutes > 60) {
            setEmotion('sad');
            setParticles([]);
        } else {
            setEmotion('neutral');
            setParticles(Array.from({ length: 2 }, (_, i) => i));
        }
    }, [isActive, inactiveMinutes]);

    const emojis = ['✨', '🎉', '🌟', '💚'];

    return (
        <div className="pet-companion">
            <div className={`pet-container emotion-${emotion}`}>
                {/* 3D Sketchfab Iframe */}
                <iframe
                    title="Cute Dog - Shiba Inu"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/d0c902263f01478c9617b1a3d6a62b79/embed"
                    className="pet-iframe"
                />

                {/* Celebration Particles */}
                {emotion === 'happy' && (
                    <div className="particles-layer">
                        {particles.map((i) => (
                            <div
                                key={i}
                                className="particle"
                                style={{
                                    '--delay': `${i * 0.1}s`,
                                    '--duration': `${0.8 + Math.random() * 0.4}s`,
                                    left: `${Math.random() * 100}%`,
                                } as React.CSSProperties}
                            >
                                {emojis[i % emojis.length]}
                            </div>
                        ))}
                    </div>
                )}

                {/* Emotion Indicator Badge */}
                <div className="emotion-badge">
                    {emotion === 'happy' && (
                        <span className="badge-happy">🐕 Happy & Joyful!</span>
                    )}
                    {emotion === 'neutral' && (
                        <span className="badge-neutral">🐕 Waiting for you...</span>
                    )}
                    {emotion === 'sad' && (
                        <span className="badge-sad">🐕 Misses you...</span>
                    )}
                    {emotion === 'very_sad' && (
                        <span className="badge-very-sad">🐕 Very sad!</span>
                    )}
                </div>
            </div>

            <style>{`
                .pet-companion {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .pet-container {
                    position: relative;
                    width: 100%;
                    max-width: 500px;
                    aspect-ratio: 1;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 251, 250, 0.98));
                    border-radius: 28px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(33, 108, 63, 0.15);
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .pet-container.emotion-happy {
                    box-shadow: 
                        0 20px 60px rgba(33, 108, 63, 0.25),
                        inset 0 0 40px rgba(99, 201, 122, 0.1);
                    transform: scale(1.02);
                    animation: glow-pulse 2s ease-in-out infinite;
                }

                .pet-container.emotion-sad {
                    box-shadow: 0 20px 60px rgba(148, 113, 113, 0.2);
                    filter: brightness(0.95) saturate(0.8);
                    animation: sad-pulse 2s ease-in-out infinite;
                }

                .pet-container.emotion-very_sad {
                    box-shadow: 0 20px 60px rgba(107, 114, 128, 0.25);
                    filter: brightness(0.9) saturate(0.6);
                }

                @keyframes glow-pulse {
                    0%, 100% {
                        box-shadow: 
                            0 20px 60px rgba(33, 108, 63, 0.25),
                            inset 0 0 40px rgba(99, 201, 122, 0.1);
                    }
                    50% {
                        box-shadow: 
                            0 20px 60px rgba(33, 108, 63, 0.35),
                            inset 0 0 60px rgba(99, 201, 122, 0.15);
                    }
                }

                @keyframes sad-pulse {
                    0%, 100% {
                        filter: brightness(0.95) saturate(0.8);
                    }
                    50% {
                        filter: brightness(0.92) saturate(0.75);
                    }
                }

                .pet-iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                    display: block;
                    background: transparent;
                }

                /* Particles */
                .particles-layer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }

                .particle {
                    position: absolute;
                    font-size: 32px;
                    animation: float-up var(--duration) ease-out forwards;
                    animation-delay: var(--delay);
                    opacity: 1;
                }

                @keyframes float-up {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-200px) scale(0.5) rotate(360deg);
                        opacity: 0;
                    }
                }

                /* Emotion Badge */
                .emotion-badge {
                    position: absolute;
                    bottom: 16px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                }

                .badge-happy,
                .badge-neutral,
                .badge-sad,
                .badge-very-sad {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 14px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    animation: badge-pulse 2s ease-in-out infinite;
                    white-space: nowrap;
                }

                .badge-happy {
                    background: rgba(99, 201, 122, 0.95);
                    color: #065f46;
                    border: 2px solid #34d399;
                }

                .badge-neutral {
                    background: rgba(156, 163, 175, 0.95);
                    color: #1f2937;
                    border: 2px solid #d1d5db;
                }

                .badge-sad {
                    background: rgba(248, 113, 113, 0.95);
                    color: #7c2d2d;
                    border: 2px solid #f87171;
                }

                .badge-very-sad {
                    background: rgba(107, 114, 128, 0.95);
                    color: #f3f4f6;
                    border: 2px solid #9ca3af;
                }

                @keyframes badge-pulse {
                    0%, 100% {
                        transform: translateX(-50%) scale(1);
                    }
                    50% {
                        transform: translateX(-50%) scale(1.05);
                    }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .pet-companion {
                        padding: 12px;
                    }

                    .particle {
                        font-size: 24px;
                    }

                    .badge-happy,
                    .badge-neutral,
                    .badge-sad,
                    .badge-very-sad {
                        padding: 8px 16px;
                        font-size: 12px;
                    }
                }

                @media (max-width: 480px) {
                    .pet-container {
                        max-width: 100%;
                    }

                    .badge-happy,
                    .badge-neutral,
                    .badge-sad,
                    .badge-very-sad {
                        padding: 6px 12px;
                        font-size: 11px;
                    }
                }
            `}</style>
        </div>
    );
}
