import React, { useState, useEffect } from 'react';

/**
 * PetCompanion3D Component
 * 
 * A cute interactive 3D dog pet that shows emotional states:
 * - Happy & Joyful when exercises are completed
 * - Sad when user is inactive
 * 
 * Usage:
 * <PetCompanion3D 
 *   isActive={true}  // boolean: whether user has completed habits today
 *   inactiveMinutes={30}  // number: minutes since last activity (optional)
 * />
 */
export default function PetCompanion3D({ isActive = true, inactiveMinutes = 0 }) {
    const [emotion, setEmotion] = useState('happy');
    const [particleCount, setParticleCount] = useState(0);

    // Determine emotion based on activity
    useEffect(() => {
        if (isActive) {
            setEmotion('happy');
            setParticleCount(8); // Celebration particles
        } else if (inactiveMinutes > 120) {
            setEmotion('very_sad');
            setParticleCount(0);
        } else if (inactiveMinutes > 60) {
            setEmotion('sad');
            setParticleCount(0);
        } else {
            setEmotion('neutral');
            setParticleCount(2);
        }
    }, [isActive, inactiveMinutes]);

    return (
        <div className="pet-companion-container">
            {/* 3D Iframe Container */}
            <div className="pet-3d-wrapper">
                <div className={`sketchfab-embed-wrapper emotion-${emotion}`}>
                    <iframe
                        title="Cute Dog - Shiba Inu"
                        frameBorder="0"
                        allowFullScreen
                        mozallowfullscreen="true"
                        webkitallowfullscreen="true"
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                        xrSpatialTracking="true"
                        executionWhileOutOfViewport="true"
                        executionWhileNotRendered="true"
                        webShare="true"
                        src="https://sketchfab.com/models/d0c902263f01478c9617b1a3d6a62b79/embed"
                        className="pet-iframe"
                    />
                </div>

                {/* Celebration Particles */}
                {emotion === 'happy' && (
                    <div className="celebration-particles">
                        {[...Array(particleCount)].map((_, i) => (
                            <div
                                key={i}
                                className="particle"
                                style={{
                                    '--delay': `${i * 0.1}s`,
                                    '--duration': `${0.8 + Math.random() * 0.4}s`,
                                    left: `${Math.random() * 100}%`,
                                }}
                            >
                                {'✨🎉🌟💚'[i % 4]}
                            </div>
                        ))}
                    </div>
                )}

                {/* Emotion Indicator */}
                <div className="emotion-indicator">
                    {emotion === 'happy' && (
                        <div className="emotion-badge happy">
                            <span className="emotion-text">🐕 Happy & Joyful!</span>
                        </div>
                    )}
                    {emotion === 'neutral' && (
                        <div className="emotion-badge neutral">
                            <span className="emotion-text">🐕 Waiting for you...</span>
                        </div>
                    )}
                    {emotion === 'sad' && (
                        <div className="emotion-badge sad">
                            <span className="emotion-text">🐕 Misses you...</span>
                        </div>
                    )}
                    {emotion === 'very_sad' && (
                        <div className="emotion-badge very-sad">
                            <span className="emotion-text">🐕 Very sad!</span>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .pet-companion-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
                    border-radius: 32px;
                }

                .pet-3d-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 500px;
                    aspect-ratio: 1;
                    background: transparent;
                }

                .sketchfab-embed-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 28px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(33, 108, 63, 0.15);
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8), rgba(249, 251, 250, 1));
                }

                .sketchfab-embed-wrapper.emotion-happy {
                    box-shadow: 
                        0 20px 60px rgba(33, 108, 63, 0.25),
                        inset 0 0 40px rgba(99, 201, 122, 0.1);
                    transform: scale(1.02);
                }

                .sketchfab-embed-wrapper.emotion-sad {
                    box-shadow: 0 20px 60px rgba(148, 113, 113, 0.2);
                    filter: brightness(0.95) saturate(0.8);
                }

                .sketchfab-embed-wrapper.emotion-very_sad {
                    box-shadow: 0 20px 60px rgba(107, 114, 128, 0.25);
                    filter: brightness(0.9) saturate(0.6);
                }

                .sketchfab-embed-wrapper.emotion-neutral {
                    box-shadow: 0 20px 60px rgba(33, 108, 63, 0.12);
                }

                .pet-iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                    display: block;
                    background: transparent;
                }

                /* Celebration Particles */
                .celebration-particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                    border-radius: 28px;
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

                /* Emotion Indicator Badge */
                .emotion-indicator {
                    position: absolute;
                    bottom: 16px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                }

                .emotion-badge {
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
                }

                .emotion-badge.happy {
                    background: rgba(99, 201, 122, 0.95);
                    color: #065f46;
                    border: 2px solid #34d399;
                }

                .emotion-badge.neutral {
                    background: rgba(156, 163, 175, 0.95);
                    color: #1f2937;
                    border: 2px solid #d1d5db;
                }

                .emotion-badge.sad {
                    background: rgba(248, 113, 113, 0.95);
                    color: #7c2d2d;
                    border: 2px solid #f87171;
                }

                .emotion-badge.very-sad {
                    background: rgba(107, 114, 128, 0.95);
                    color: #f3f4f6;
                    border: 2px solid #9ca3af;
                }

                .emotion-text {
                    display: inline-block;
                    font-size: 14px;
                }

                @keyframes badge-pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .pet-companion-container {
                        padding: 12px;
                    }

                    .emotion-badge {
                        padding: 8px 16px;
                        font-size: 12px;
                    }

                    .particle {
                        font-size: 24px;
                    }
                }

                @media (max-width: 480px) {
                    .pet-3d-wrapper {
                        max-width: 100%;
                    }

                    .emotion-badge {
                        padding: 6px 12px;
                        font-size: 11px;
                    }
                }
            `}</style>
        </div>
    );
}
