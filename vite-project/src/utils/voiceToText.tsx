import toWav from "audiobuffer-to-wav";

export const base64Converter = (blob: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result);
    };
  });
};

export const v2t = async (audioUrl: string) => {
  return new Promise(async (res, rej) => {
    const audioContext = new AudioContext();
    const resp = await fetch(audioUrl, { method: "GET" });
    const arrBuff = await resp.arrayBuffer();
    let textResponse;
    await audioContext.decodeAudioData(arrBuff, async (buffer) => {
      let wav = toWav(buffer);
      let blob = new window.Blob([new DataView(wav)], {
        type: "audio/wav",
      });
      const base64String = await base64Converter(blob);
      if (typeof base64String !== "string") return;
      const body = {
        audio: base64String.split(",")[1],
        language: "en-IN",
      };
      const resp = await fetch("http://127.0.0.1:5000/voice_to_text", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      textResponse = await resp.json();
      console.log(textResponse);
      if (textResponse.error) rej(textResponse.error);
      else res(textResponse.text);
    });
  });
};
