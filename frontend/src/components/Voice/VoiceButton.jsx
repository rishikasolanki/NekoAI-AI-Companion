import SpeechRecognition, {
    useSpeechRecognition
} from "react-speech-recognition";

import "./VoiceButton.css";

export default function VoiceButton({

    onResult

}){

const {

transcript,

listening,

resetTranscript

}=useSpeechRecognition();

function start(){

resetTranscript();

SpeechRecognition.startListening({

continuous:false

});

}

function stop(){

SpeechRecognition.stopListening();

onResult(transcript);

}

return(

<button

onMouseDown={start}

onMouseUp={stop}

>

{listening ? "🎤 Listening..." : "🎤"}

</button>

);

}