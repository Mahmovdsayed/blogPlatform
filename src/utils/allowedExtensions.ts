/* This TypeScript code snippet is defining an object named `allowedExtensions` that contains different
file types categorized into image, video, audio, document, and code. Each category has an array of
file extensions that are commonly associated with that type. */
export const allowedExtensions = {
  image: ["jpg", "jpeg", "png"],
  video: ["mp4", "mov", "wmv", "avi", "mkv", "flv"],
  audio: ["mp3", "wav", "aac", "ogg", "flac", "m4a"],
  document: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "odt"],
  code: [
    "html",
    "htm",
    "css",
    "js",
    "java",
    "py",
    "cpp",
    "c",
    "php",
    "sh",
    "rb",
  ],
};

export default allowedExtensions;
