import { useContext } from "react";

import { EmotionContext } from "../context/EmotionContext";

export default function useEmotion(){

    return useContext(EmotionContext);

}