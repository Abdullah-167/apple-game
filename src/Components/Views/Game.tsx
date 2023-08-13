import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import appleImage from '../../../public/apple.png';

interface Apple {
    x: number;
    y: number;
    clicked: boolean;
    transitionDuration?: string;
    bounce?: boolean; // New property for bounce animation
}

const Game: React.FC = () => {
    const [apples, setApples] = useState<Apple[]>([]);
    const [score, setScore] = useState<number>(0);
    const [clickedApples, setClickedApples] = useState<number[]>([]);
    const [bounceAnimations, setBounceAnimations] = useState<boolean[]>([]);

    const fallInterval = 1500;
    const transitionDuration = '3s';

    useEffect(() => {
        const fallApples = () => {

            const screenThreshold = window.innerWidth < 768 ? 0.76 : 0.73;

            setApples((prevApples) =>
                prevApples.map((apple, index) => {
                    const isClicked = clickedApples.includes(index);

                    if (!isClicked && apple.y + 5 <= window.innerHeight * screenThreshold) {
                        return {
                            ...apple,
                            y: apple.y + 5,
                            transitionDuration: transitionDuration,
                        };
                    } else if (apple.y < window.innerHeight * screenThreshold) {
                        setBounceAnimations((prevAnimations) => {
                            const newAnimations = [...prevAnimations];
                            newAnimations[index] = true;
                            return newAnimations;
                        });
                        return apple;
                    }

                    return apple;
                })
            );

            requestAnimationFrame(fallApples);
        };

        const fallAnimation = requestAnimationFrame(fallApples);

        const appleSpawnInterval = setInterval(() => {
            setApples((prevApples): any => [
                ...prevApples,
                {
                    x: Math.random() * window.innerWidth,
                    y: 0,
                },
            ]);
        }, fallInterval);

        return () => {
            cancelAnimationFrame(fallAnimation);
            clearInterval(appleSpawnInterval);
        };
    }, [clickedApples]);

    const handleAppleClick = (index: number) => {
        setClickedApples((prevClickedApples) => [...prevClickedApples, index]);
        setScore(score + 1);

        const popSound = document.getElementById('popSound') as HTMLAudioElement | null;
        popSound?.play();

        setApples((prevApples) =>
            prevApples.map((apple, i) => {
                if (i === index) {
                    return {
                        ...apple,
                        clicked: true,
                    };
                }
                return apple;
            })
        );
    };

    const resetGame = () => {
        setScore(0);
        setClickedApples([]);
    };

    return (
        <div>
            <div className='bg-image' style={{ maxHeight: '80vh', overflow: 'hidden' }}>
                <div className='max-w-[1300px] mx-auto '>
                    {apples.map((apple, index) => (
                        !apple.clicked && (
                            <div
                                key={index}
                                className={`absolute`}
                                style={{
                                    top: apple.y,
                                    left: apple.x,
                                    cursor: 'pointer',
                                    transitionDuration: apple.transitionDuration || '',
                                    animation: bounceAnimations[index] ? 'bounce 4s 1 alternate' : 'none',
                                }}
                                onClick={() => handleAppleClick(index)}
                            >
                                <Image src={appleImage} alt='Apple' width={50} height={50} />
                            </div>
                        )
                    ))}
                    <audio id='popSound' src='/pop.wav'></audio>
                    <p className='text-3xl py-5 text-center font-semibold'>Pick The Apple</p>
                </div>
            </div>
            <div className='bg-[#008000] w-full  text-white h-[20vh] px-7 py-9 sm:py-2'>
                <div className='text-2xl font-semibold pb-3'>Score: {score}</div>
                <button className='bg-[#ABEA38] px-5 py-2 rounded-lg' onClick={resetGame}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Game;
