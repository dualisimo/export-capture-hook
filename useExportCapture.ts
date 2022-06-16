import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { ExportTypeT, takeScreenshotT, useExportCaptureT } from "./types";

const createFileName = (extension: string, name: string) =>
  `${name}.${extension}`;

const useScreenshot = (
  type: string,
  quality: number
): {
  takeScreenshot: takeScreenshotT;
  image?: string;
} => {
  const [image, setImage] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (error) {
      console.log("error", error);
    }
  }, [error]);

  const takeScreenshot: takeScreenshotT = async (node) =>
    html2canvas(node)
      .then((canvas) => {
        const croppedCanvas = document.createElement("canvas");
        const croppedCanvasContext = croppedCanvas.getContext("2d");

        const cropPositionTop = 0;
        const cropPositionLeft = 0;
        const cropWidth = canvas.width;
        const cropHeight = canvas.height;

        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;

        if (croppedCanvasContext) {
          croppedCanvasContext.drawImage(
            canvas,
            cropPositionLeft,
            cropPositionTop
          );
        }

        const base64Image = croppedCanvas.toDataURL(type, quality);

        setImage(base64Image);
        return base64Image;
      })
      .catch((e) => setError(e));

  return { image, takeScreenshot };
};

export const useExportCapture: useExportCaptureT = (
  refToCaputre,
  exportType,
  fileType?,
  fileName?
) => {
  const [exportTypeState, setExportTypeState] = useState<
    ExportTypeT | undefined
  >(exportType);

  const { image, takeScreenshot } = useScreenshot("image/png", 1.0);

  const createExport = (node: HTMLElement): void => {
    html2canvas(node, {
      useCORS: true,
    }).then((canvas) => {
      if (exportTypeState === "EXPORT") {
        const source = document.createElement("a");
        source.href = canvas.toDataURL("image/png");
        source.download = createFileName(
          fileType ? fileType : "png",
          fileName ? fileName : `capture-${Date.now()}`
        );
        source.click();
      }

      if (exportTypeState === "COPY") {
        canvas.toBlob((blob) =>
          navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob as Blob }),
          ])
        );
      }

      setExportTypeState(undefined);
    });
  };

  const exportCapture = (): void => {
    if (exportTypeState && refToCaputre.current) {
      takeScreenshot(refToCaputre.current);
    }
  };

  useEffect(() => {
    if (image && refToCaputre.current) {
      createExport(refToCaputre.current);
    }
  }, [image]);

  return {
    exportCapture,
  };
};
