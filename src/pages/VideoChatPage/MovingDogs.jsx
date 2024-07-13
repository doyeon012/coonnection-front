import React, { useState, useEffect } from 'react';
import dogWalkGif from '../../assets/dogWalk.gif';

const MovingDogs = ({ sessionData }) => {
    const [dogPositions, setDogPositions] = useState(
        Array(4).fill({ x: 50, y: 50 })
    );
    const [dogDestinations, setDogDestinations] = useState(Array(4).fill(null));
    const [movingDogs, setMovingDogs] = useState(Array(4).fill(true));
    const [showBubble, setShowBubble] = useState(Array(4).fill(false));
    const [bubbleTimers, setBubbleTimers] = useState(Array(4).fill(null));
    const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });

    const getRandomPosition = () => ({
        x: Math.random() * 90,
        y: Math.random() * 90,
    });

    const distance = (p1, p2) =>
        Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

    useEffect(() => {
        const interval = setInterval(() => {
            setDogPositions((prevPositions) => {
                if (!Array.isArray(prevPositions)) return prevPositions;
                return prevPositions.map((pos, index) => {
                    if (!Array.isArray(movingDogs) || !movingDogs[index])
                        return pos;
                    let dest = Array.isArray(dogDestinations)
                        ? dogDestinations[index]
                        : null;
                    if (!dest || distance(pos, dest) < 1) {
                        dest = getRandomPosition();
                        setDogDestinations((prev) => {
                            if (!Array.isArray(prev)) return prev;
                            return prev.map((d, i) => (i === index ? dest : d));
                        });
                    }
                    const dx = dest.x - pos.x;
                    const dy = dest.y - pos.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const speed = 0.35;
                    return {
                        x: pos.x + (dx / length) * speed,
                        y: pos.y + (dy / length) * speed,
                    };
                });
            });
        }, 50);
        return () => clearInterval(interval);
    }, [movingDogs, dogDestinations]);

    const handleDogClick = (index, event) => {
        if (!sessionData[index]) return;

        const { nickname, interests } = sessionData[index];

        if (bubbleTimers[index]) {
            clearTimeout(bubbleTimers[index]);
        }
        setShowBubble((prev) => {
            if (!Array.isArray(prev)) return prev;
            return prev.map((v, i) => (i === index ? true : v));
        });
        setMovingDogs((prev) => {
            if (!Array.isArray(prev)) return prev;
            return prev.map((v, i) => (i === index ? false : v));
        });

        const newTimer = setTimeout(() => {
            setShowBubble((prev) => {
                if (!Array.isArray(prev)) return prev;
                return prev.map((v, i) => (i === index ? false : v));
            });
            setMovingDogs((prev) => {
                if (!Array.isArray(prev)) return prev;
                return prev.map((v, i) => (i === index ? true : v));
            });
        }, 10000);

        setBubbleTimers((prev) => {
            if (!Array.isArray(prev)) return prev;
            return prev.map((timer, i) => (i === index ? newTimer : timer));
        });

        if (event && event.target) {
            const rect = event.target.getBoundingClientRect();
            setBubblePosition({
                top: rect.top - 40,
                left: rect.right + 10,
            });
        }
    };

    return (
        <div className="flex-1 relative" style={{ height: '300px' }}>
            {dogPositions.map((pos, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transition: 'all 0.05s linear',
                    }}
                >
                    <img
                        src={dogWalkGif}
                        alt={`Dog ${index + 1}`}
                        className="w-14 h-14 cursor-pointer"
                        onClick={(event) => handleDogClick(index, event)}
                    />
                    {showBubble[index] && (
                        <div
                            className="absolute bg-white p-2 rounded-md shadow-md"
                            style={{
                                top: pos.y < 50 ? '100%' : 'auto',
                                bottom: pos.y >= 50 ? '100%' : 'auto',
                                left: pos.x < 50 ? '0' : 'auto',
                                right: pos.x >= 50 ? '0' : 'auto',
                                width: '150px',
                            }}
                        >
                            <h3 className="text-sm font-semibold">
                                {sessionData[index]?.nickname} 관심사
                            </h3>
                            <p>{sessionData[index]?.interests[0]}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MovingDogs;
