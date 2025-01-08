import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export async function POST(req) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(new Response("File upload error", { status: 500 }));
      }

      const filePath = files.file.filepath;
      const newFilePath = path.join(uploadDir, files.file.originalFilename);

      fs.rename(filePath, newFilePath, (renameErr) => {
        if (renameErr) {
          reject(new Response("File save error", { status: 500 }));
        }

        const fileUrl = `/uploads/${files.file.originalFilename}`;
        resolve(
          new Response(
            JSON.stringify({
              fileUrl,
              transcription: "This is a sample transcription.",
            }),
            { status: 200 }
          )
        );
      });
    });
  });
}
