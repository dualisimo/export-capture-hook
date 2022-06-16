import { RefObject } from "react";

export type takeScreenshotT = (node: HTMLDivElement) => Promise<string | void>;

export type ExportTypeT = "COPY" | "EXPORT";

export type useExportCaptureT = (
  refToCaputre: RefObject<HTMLDivElement>,
  exportType: ExportTypeT,
  fileType?: "png" | "jpg",
  fileName?: string
) => { exportCapture: () => void };
