import { useEffect, useRef, useState } from "react";
import { LuMic, LuMicOff } from "react-icons/lu";

const App = () => {
  const [status, setStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorder = useRef<MediaRecorder>();

  const startRecording = async () => {
    try {
      // check the devices and browser support
      if (!navigator.mediaDevices) {
        alert("You Don't have required hardware");
        throw Error("");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!stream) {
        alert("Browser not supported");
        throw Error("");
      }
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;

      mediaRecorder.current.start();
      setStatus("recording");

      let chunks: Blob[] = [];
      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
        setAudioChunks([...audioChunks, ...chunks]);
      };
      mediaRecorder.current.onstop = (e) => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        let reader = new FileReader();
        reader.onload = async () => {
          if (reader.result === null) return;
          if (typeof reader.result === "string") {
            const base64String = reader.result.split(",")[1];
            const body = { audio: base64String, language: "en-IN" };
            console.log(body);
            // const text = await fetch("http://127.0.0.1:5000/voice_to_text", {
            //   method: "POST",
            //   body: JSON.stringify(body),
            // });
            // console.log(text);
          }
        };
        reader.readAsDataURL(blob);
      };
    } catch (error) {}
  };
  const stopRecording = () => {
    try {
      if (!mediaRecorder.current) {
        alert("No Recorder To Stop");
        throw new Error("");
      }
      mediaRecorder.current?.stop();
      setStatus("inactive");
    } catch (error) {}
  };
  useEffect(() => {
    console.log(audioChunks, audioUrl);
  }, [audioChunks, audioUrl]);
  return (
    <section className="min-h-[30rem] w-full bg-[#1e293b]/50 container mx-auto p-8 my-5 rounded-lg border border-gray-400 flex flex-col">
      <div></div>
      <div className="mt-auto flex gap-4">
        <input
          className="w-full p-2 rounded-lg bg-primary-foreground/10 outline-none"
          placeholder="Enter Your Message"
        />
        <div>
          {status === "inactive" ? (
            <button
              className="w-10 rounded-full flex justify-center overflow-hidden"
              onClick={startRecording}
            >
              <LuMicOff className="h-full text-xl w-full p-2 bg-green-500" />
            </button>
          ) : (
            <button
              className="w-10 rounded-full flex justify-center overflow-hidden"
              onClick={stopRecording}
            >
              <LuMic className="h-full text-xl w-full p-2 bg-destructive" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default App;
