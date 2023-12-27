const ORIGINAL = "original";

export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : ORIGINAL}/${id}`;
}
