import type { ChangeEvent } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFileAndUrl = (
  event: ChangeEvent<HTMLInputElement>,
): [FileList, string[]] => {
  const dataTransfer = new DataTransfer();

  if (event.target.files) {
    Array.from(event.target.files).forEach((file) => {
      dataTransfer.items.add(file);
    });
  }

  const files = dataTransfer.files;
  const filesUrl: string[] = [];

  Array.from(files).forEach((file) => {
    const fileUrl = URL.createObjectURL(file);
    filesUrl.push(fileUrl);
  });

  return [files, filesUrl];
};
