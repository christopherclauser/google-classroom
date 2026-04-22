export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
}

export const GAMES: Game[] = [
  {
    id: "2048",
    title: "2048",
    description: "Join the numbers and get to the 2048 tile! A classic addictive puzzle game.",
    thumbnail: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=800&auto=format&fit=crop",
    url: "https://play2048.co/",
  },
  {
    id: "hextris",
    title: "HEXTRIS",
    description: "A fast-paced puzzle game inspired by Tetris. Rotate the hexagon to match colors.",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    url: "https://hextris.io/",
  },
  {
    id: "slope",
    title: "SLOPE",
    description: "The ultimate speed run game. Drive your ball down the steep slope as far as possible.",
    thumbnail: "https://images.unsplash.com/photo-1626379930801-44755a5223c7?q=80&w=800&auto=format&fit=crop",
    url: "https://slope-game.github.io/",
  },
  {
    id: "tetris",
    title: "TETRIS",
    description: "The world's most popular puzzle game. Clear lines and score points.",
    thumbnail: "https://images.unsplash.com/photo-1635241936380-9163669a82af?q=80&w=800&auto=format&fit=crop",
    url: "https://tetris.com/play-tetris",
  },
  {
    id: "chrome-dino",
    title: "DINO RUN",
    description: "The famous offline dinosaur game. Jump over obstacles and run for as long as you can.",
    thumbnail: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=800&auto=format&fit=crop",
    url: "https://dino-run.com/",
  }
];
