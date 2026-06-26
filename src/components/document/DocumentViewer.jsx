import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Lock,
} from "lucide-react";

const TEXT_EXTS = ["txt", "md", "log", "json", "yaml", "yml", "xml", "html", "css", "js"];
const CSV_EXTS = ["csv", "tsv"];
const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"];
const VIDEO_EXTS = ["mp4", "mov", "webm", "avi", "mkv"];
const AUDIO_EXTS = ["mp3", "wav", "m4a", "ogg", "aac", "flac"];
const PDF_EXTS = ["pdf"];
const OFFICE_EXTS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

function getViewerType(ext) {
  const e = (ext || "").toLowerCase();
  if (PDF_EXTS.includes(e)) return "pdf";
  if (IMAGE_EXTS.includes(e)) return "image";
  if (VIDEO_EXTS.includes(e)) return "video";
  if (AUDIO_EXTS.includes(e)) return "audio";
  if (CSV_EXTS.includes(e)) return "csv";
  if (TEXT_EXTS.includes(e)) return "text";
  if (OFFICE_EXTS.includes(e)) return "office";
  return "unsupported";
}

// Detect YouTube / Vimeo URL → return iframe-embeddable URL, else null
function getEmbedUrl(url) {
  if (!url) return null;
  // YouTube: youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/embed/<id>, youtube.com/shorts/<id>
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // Vimeo: vimeo.com/<id>
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export default function DocumentViewer({ document: doc, open, onOpenChange }) {
  if (!doc) return null;
  // Detect YouTube/Vimeo trước; nếu match thì luôn coi như video
  const embed = getEmbedUrl(doc.fileUrl);
  const type = embed ? "video" : getViewerType(doc.fileType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[92vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-5 pt-5 pb-3 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="truncate" title={doc.title}>
                {doc.title}
              </DialogTitle>
              {doc.description && (
                <DialogDescription className="line-clamp-1">
                  {doc.description}
                </DialogDescription>
              )}
              {doc.source && (
                <p className="text-xs text-gray-500 italic mt-1 truncate">
                  Nguồn: {doc.source}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {doc.allowDownload ? (
                <Button asChild size="sm" variant="outline">
                  <a href={doc.fileUrl} download>
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Tải về
                  </a>
                </Button>
              ) : (
                <Button size="sm" variant="outline" disabled title="Không cho tải">
                  <Lock className="h-3.5 w-3.5 mr-1.5" />
                  Khóa tải
                </Button>
              )}
              <Button asChild size="sm" variant="outline">
                <a
                  href={`/documents/${doc.id}/view`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Tab mới
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-gray-50">
          <ViewerBody type={type} doc={doc} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function getDocumentViewerType(ext) {
  return getViewerType(ext);
}

export function ViewerBody({ type, doc }) {
  if (type === "pdf") {
    return (
      <iframe
        src={doc.fileUrl}
        title={doc.title}
        className="w-full h-[78vh] border-0 bg-white"
      />
    );
  }

  if (type === "image") {
    return (
      <div className="flex items-center justify-center p-4 min-h-[60vh]">
        <img
          src={doc.fileUrl}
          alt={doc.title}
          className="max-w-full max-h-[78vh] object-contain"
        />
      </div>
    );
  }

  if (type === "video") {
    const embed = getEmbedUrl(doc.fileUrl);
    if (embed) {
      // YouTube / Vimeo → iframe embed
      return (
        <div className="bg-black flex items-center justify-center">
          <div className="w-full" style={{ maxWidth: 1100 }}>
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src={embed}
                title={doc.title}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      );
    }
    // File video tự upload (Cloudinary, etc.)
    return (
      <div className="flex items-center justify-center p-4 bg-black">
        <video
          src={doc.fileUrl}
          controls
          controlsList={doc.allowDownload ? undefined : "nodownload"}
          className="max-w-full max-h-[78vh]"
        />
      </div>
    );
  }

  if (type === "audio") {
    return (
      <div className="flex items-center justify-center p-8 min-h-[40vh]">
        <div className="w-full max-w-xl bg-white rounded-xl border p-6 text-center">
          <div className="h-16 w-16 rounded-full bg-pink-100 text-pink-600 mx-auto mb-3 flex items-center justify-center">
            <FileText className="h-7 w-7" />
          </div>
          <p className="font-semibold text-gray-900 mb-4">{doc.title}</p>
          <audio
            src={doc.fileUrl}
            controls
            controlsList={doc.allowDownload ? undefined : "nodownload"}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  if (type === "csv") {
    return <CsvViewer url={doc.fileUrl} />;
  }

  if (type === "text") {
    return <TextViewer url={doc.fileUrl} />;
  }

  if (type === "office") {
    const officeSrc = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      doc.fileUrl,
    )}`;
    return (
      <iframe
        src={officeSrc}
        title={doc.title}
        className="w-full h-[78vh] border-0 bg-white"
      />
    );
  }

  return (
    <div className="p-10 text-center">
      <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
      <p className="font-medium text-gray-700">
        Trình duyệt không hỗ trợ xem trực tiếp định dạng <code>.{doc.fileType}</code>
      </p>
      {doc.allowDownload ? (
        <p className="text-sm text-gray-500 mt-1">
          Hãy tải về để xem bằng phần mềm phù hợp.
        </p>
      ) : (
        <p className="text-sm text-orange-600 mt-1">
          File không cho phép tải. Vui lòng liên hệ giáo vụ.
        </p>
      )}
    </div>
  );
}

// ===== Text viewer (txt, md, log, json,...) =====
function TextViewer({ url }) {
  const { content, loading, error } = useFetchText(url);

  if (loading) return <LoadingBox />;
  if (error) return <ErrorBox message={error} />;

  return (
    <pre className="m-4 p-4 bg-white rounded border overflow-auto text-sm whitespace-pre-wrap break-words font-mono">
      {content}
    </pre>
  );
}

// ===== CSV viewer — parse và render thành table =====
function CsvViewer({ url }) {
  const { content, loading, error } = useFetchText(url);
  const rows = useMemo(() => (content ? parseCsv(content) : []), [content]);

  if (loading) return <LoadingBox />;
  if (error) return <ErrorBox message={error} />;
  if (rows.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500 p-8">File CSV trống</p>
    );
  }

  const [header, ...body] = rows;

  return (
    <div className="p-4">
      <div className="bg-white rounded border overflow-auto max-h-[75vh]">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {header.map((cell, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-r last:border-r-0"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} className="hover:bg-blue-50/50">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-3 py-2 border-b border-r last:border-r-0 text-gray-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {body.length} dòng · {header.length} cột
      </p>
    </div>
  );
}

// ===== Helpers =====
function useFetchText(url) {
  const [state, setState] = useState({
    content: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ content: null, loading: true, error: null });

    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (!cancelled) setState({ content: text, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            content: null,
            loading: false,
            error: err.message || "Không tải được nội dung",
          });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

// Mini CSV parser — handle quoted fields with embedded commas/newlines/escaped quotes
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(cur);
        cur = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.length > 0));
}

function LoadingBox() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="p-10 text-center">
      <AlertCircle className="h-10 w-10 text-red-300 mx-auto mb-2" />
      <p className="font-medium text-red-700">Không tải được nội dung</p>
      <p className="text-sm text-gray-500 mt-1">{message}</p>
    </div>
  );
}
