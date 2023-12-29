const API_KEY = "5e8adfbcbe0ad3d1d09d10601517553f";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IGetMoviesResult {
  dates: Dates;
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface Dates {
  maximum: Date;
  minimum: Date;
}

export interface IMovie {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  title: string;
  genre_ids: {
    [key: number]: number;
  };
}

export async function getMovies() {
  return await (
    await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  ).json();
}
