import { useState, useEffect } from "react";

export default function usePetMovement() {

    const [position, setPosition] = useState({
        x: 100,
        y: 100
    });

    const [direction, setDirection] = useState(1);

    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {

        if (isDragging) return;

        const interval = setInterval(() => {

            setPosition(prev => {

                let newX = prev.x + direction * 4;

                if (newX > window.innerWidth - 180)
                    setDirection(-1);

                if (newX < 0)
                    setDirection(1);

                return {
                    ...prev,
                    x: newX
                };

            });

        }, 30);

        return () => clearInterval(interval);

    }, [direction, isDragging]);

    return {
        position,
        setPosition,
        isDragging,
        setIsDragging
    };

}