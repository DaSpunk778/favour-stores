"use server";

// Image upload for the admin dashboard. Saves files the admin picks from their
// computer into `public/uploads/` and returns the web paths to store on the
// product (e.g. "/uploads/kettle-….jpg"). Files under /public are served
// statically and work with next/image, so no image-host config is needed.
//
// This mirrors the JSON store's tradeoff: fs writes work locally and on a
// persistent Node host, but not on read-only/ephemeral serverless (e.g.
// Vercel). Real cloud storage (Cloudinary/S3/UploadThing) swaps in here later,
// the same way the DB swaps into lib/product-store.ts — this signature stays.

import fs from "node:fs/promises";
import path from "node:path";

import { slugify } from "@/lib/products";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Allowed image types → file extension.
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8MB per file (defense-in-depth; client also checks)

export type UploadResult = {
  ok: boolean;
  paths: string[];
  error?: string;
};

export async function uploadProductImages(
  formData: FormData
): Promise<UploadResult> {
  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return { ok: false, paths: [], error: "No file selected." };
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const paths: string[] = [];
  for (const file of files) {
    const ext = EXT_BY_TYPE[file.type];
    if (!ext) {
      return {
        ok: false,
        paths: [],
        error: `Unsupported file type${
          file.type ? ` (${file.type})` : ""
        }. Use JPG, PNG, WEBP, GIF, or AVIF.`,
      };
    }
    if (file.size > MAX_BYTES) {
      return {
        ok: false,
        paths: [],
        error: `"${file.name}" is larger than 8MB.`,
      };
    }

    // Unique, safe filename: slugified original name + timestamp + random.
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
    const unique = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const filename = `${base}-${unique}.${ext}`;

    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
    paths.push(`/uploads/${filename}`);
  }

  return { ok: true, paths };
}
