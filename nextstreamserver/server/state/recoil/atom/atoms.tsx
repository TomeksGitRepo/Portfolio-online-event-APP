import { atom } from "recoil";

export const currentySelectedMovie = atom({
  key: "currentySelectedMovie",
  default: {
    movieURL: "",
  },
});

export const allMovies = atom({
  key: "allMovies",
  default: {
    moviesInfo: [],
  },
});

export const isAllMoviesDownloading = atom({
  key: "isAllMoviesDownloading",
  default: {
    isAllMoviesDownloading: false,
  },
});
