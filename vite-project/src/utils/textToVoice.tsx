export const base64ToBlob = (base64audio: string): Blob => {
  let binaryData = atob(base64audio);
  var arrayBuffer = new ArrayBuffer(binaryData.length);
  var uint8Array = new Uint8Array(arrayBuffer);
  for (var i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }
  let blob = new Blob([uint8Array], { type: "audio/mpeg" });
  return blob;
};
