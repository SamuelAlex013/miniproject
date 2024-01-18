import { useEffect, useRef, useState } from "react";
import { LuMic, LuMicOff } from "react-icons/lu";
import toWav from "audiobuffer-to-wav";
import xhr from "xhr";

const App = () => {
  const [status, setStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorder = useRef<MediaRecorder>();

  const base64Converter = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };
  const startRecording = async () => {
    try {
      // check the devices and browser support
      const audioContext = new AudioContext();
      if (!navigator.mediaDevices) {
        alert("You Don't have required hardware");
        throw Error("");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      if (!stream) {
        alert("Browser not supported");
        throw Error("");
      }
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorder.current = recorder;

      mediaRecorder.current.start();
      setStatus("recording");

      let chunks: Blob[] = [];
      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
        setAudioChunks(chunks);
        // setAudioUrl(URL.createObjectURL(chunks[0]));
      };
      mediaRecorder.current.onstop = async (e) => {
        const blob = chunks;
        const url = URL.createObjectURL(blob[0]);
        const f = await xhr(
          {
            uri: url,
            responseType: "arraybuffer",
          },
          (err, _, resp) => {
            if (err) throw err;
            audioContext.decodeAudioData(resp, async (buffer) => {
              var wav = toWav(buffer);
              var blob = new window.Blob([new DataView(wav)], {
                type: "audio/wav",
              });
              const base64String = await base64Converter(blob);
              if (typeof base64String !== "string") return;
              const body = {
                audio: base64String.split(",")[1],
                language: "en-IN",
              };
              const text = await fetch("http://127.0.0.1:5000/voice_to_text", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                  "Content-Type": "application/json",
                },
              });
              console.log(await text.json());
            });
          },
        );
        setAudioUrl(url);

        const formData = new FormData();
        formData.append("audio", blob[0], "recorded.ogg");

        const base64String = await base64Converter(blob[0]);
        if (typeof base64String !== "string") return;
      };
    } catch (error) {
      console.log(error);
    }
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
