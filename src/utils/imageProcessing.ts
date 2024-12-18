export const applyImageAdjustments = (
  canvas: HTMLCanvasElement,
  brightness: number,
  contrast: number
): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness
    const brightnessValue = (brightness - 100) * 2.55;
    data[i] = Math.min(255, Math.max(0, data[i] + brightnessValue));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightnessValue));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightnessValue));

    // Apply contrast
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    data[i] = Math.min(255, Math.max(0, contrastFactor * (data[i] - 128) + 128));
    data[i + 1] = Math.min(255, Math.max(0, contrastFactor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.min(255, Math.max(0, contrastFactor * (data[i + 2] - 128) + 128));
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

export const convertToFormat = async (
  canvas: HTMLCanvasElement,
  format: string = "png"
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert image"));
        }
      },
      `image/${format}`,
      format === "jpeg" ? 0.9 : 1.0
    );
  });
};

export const loadImageFromUrl = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image from URL"));
    img.src = url;
  });
};