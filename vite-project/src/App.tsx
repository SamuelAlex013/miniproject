import { useRef, useState } from "react";
import {
  LuCircle,
  LuLoader,
  LuMic,
  LuMicOff,
  LuVolume2,
  LuSend,
} from "react-icons/lu";
import { v2t, base64Converter } from "./utils/voiceToText";

interface IMessage {
  user: string;
  id: number;
  response: string;
}
const App = () => {
  const [status, setStatus] = useState("inactive");
  const mediaRecorder = useRef<MediaRecorder>();
  const [messageList, setMessageList] = useState<Array<IMessage>>([]);
  const [processing, setProcessing] = useState(false);
  const chunksRef = useRef<Blob[]>();
  const [inputBlock, setInputBlock] = useState("");

  const onStopHandler = async () => {
    setProcessing(true);
    if (!chunksRef.current) return;
    const blob = chunksRef.current;
    const url = URL.createObjectURL(blob[0]);
    const text = (await v2t(url)) as string;
    console.log(text);
    setMessageList([
      ...messageList,
      { id: messageList.length + 1, user: "-1", response: text },
    ]);
    setProcessing(false);
  };

  const startRecording = async () => {
    try {
      // check the devices and browser support
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
        chunksRef.current = chunks;
      };
      mediaRecorder.current.onstop = onStopHandler;
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
  const t2v = async () => {
    if (inputBlock.length === 0) return;
    setProcessing(true);
    try {
      const body = { text: inputBlock, language_code: "en-IN" };
      console.log(body);
      const resp = await fetch("http://127.0.0.1:5000/text_to_voice", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(await resp.json());
      // console.log(URL.createObjectURL(response));
      // const unit8Audio = new TextEncoder().encode(response.audio);
      // console.log(unit8Audio);
      // const blob = new Blob([unit8Audio], {
      //   type: "audio/wav",
      // });
      // console.log(blob);
      // const url = URL.createObjectURL(blob);
      // console.log(url);
    } catch (error) {
      console.log(error);
    }
    setInputBlock("");
    setProcessing(false);
  };

  return (
    <section className="min-h-[30rem] w-full bg-[#1e293b]/50 container mx-auto my-5 rounded-lg border border-gray-400 flex flex-col">
      <div className="h-8 relative bottom-6">
        {status === "recording" && (
          <LuCircle className="fill-red-500 stroke-red-500 mx-auto border rounded-full h-5 w-5 p-[0.1rem]" />
        )}
      </div>
      <div className="flex flex-col h-full overflow-scroll p-8">
        {messageList.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 mb-8">
            {item.user === "-1" ? (
              <LuVolume2 className="text-8xl border border-border bg-card/10 p-2 rounded-xl w-fit self-end" />
            ) : (
              <p className="max-w-[80%] w-fit bg-card/10 p-2 rounded-lg self-end">
                {item.user}
              </p>
            )}
            {item.response === "-1" ? (
              <LuVolume2 className="text-8xl border border-border p-2 rounded-xl bg-green-500/40" />
            ) : (
              <p className="max-w-[80%] w-fit bg-green-500/40 p-2 rounded-lg">
                {item.response}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-auto flex gap-4 sticky bottom-0 px-8 py-4 bg-[#1e293b] rounded">
        <input
          className="w-full p-2 rounded-lg bg-primary-foreground/10 outline-none"
          placeholder="Enter Your Message"
          disabled={processing}
          value={inputBlock}
          onChange={(e) => setInputBlock(e.target.value)}
        />
        {inputBlock.length === 0 ? (
          <div className="flex justify-center items-center w-10">
            {processing ? (
              <LuLoader className="animate-spin" />
            ) : status === "inactive" ? (
              <button
                className="w-10 rounded-full flex justify-center overflow-hidden"
                onClick={startRecording}
              >
                <LuMicOff className="h-full text-xl w-full p-2 bg-green-500 animate-pop-up" />
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
        ) : (
          <div className="flex justify-center items-center w-10">
            {processing ? (
              <LuLoader className="animate-spin" />
            ) : (
              <button
                className="w-10 rounded-full flex justify-center overflow-hidden"
                onClick={t2v}
              >
                <LuSend className="h-full text-xl w-full p-2 bg-green-500 rounded-full animate-pop-up" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
