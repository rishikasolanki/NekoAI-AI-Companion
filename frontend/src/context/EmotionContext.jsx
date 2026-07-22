import { useState } from "react";

import { EmotionContext } from "./emotionContext";

export function EmotionProvider({ children }) {

    const [emotion, setEmotion] = useState("idle");

    return (

        <EmotionContext.Provider
            value={{
                emotion,
                setEmotion
            }}
        >

            {children}

        </EmotionContext.Provider>

    );

}
