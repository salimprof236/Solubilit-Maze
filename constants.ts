import { Question } from './types';

// 0 = Path, 1 = Wall
export const MAZE_GRID = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // Center row (Player starts at 7,7)
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const GRID_SIZE = 15;
export const SPAWN_POS = { x: 7, y: 7 };

// Locations for answers (Top Left, Top Right, Bottom Left, Bottom Right)
export const ANSWER_LOCATIONS = [
  { x: 1, y: 1 },
  { x: 13, y: 1 },
  { x: 1, y: 13 },
  { x: 13, y: 13 }
];

// Strictly extracted from the provided PDF course
export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Un mélange est constitué de...",
    answers: [
      { id: 'a', text: "Plusieurs constituants", isCorrect: true },
      { id: 'b', text: "Un seul constituant", isCorrect: false },
      { id: 'c', text: "Rien du tout", isCorrect: false }
    ],
    explanation: "Comme vu sur la diapositive 12, un mélange contient toujours plusieurs constituants."
  },
  {
    id: 2,
    text: "Quand on met du sel dans l'eau, il...",
    answers: [
      { id: 'a', text: "Fond", isCorrect: false },
      { id: 'b', text: "Se dissout", isCorrect: true },
      { id: 'c', text: "Disparaît", isCorrect: false }
    ],
    explanation: "Le sel ne disparaît pas, il se dissout (Diapo 14)."
  },
  {
    id: 3,
    text: "Le mélange Eau + Sirop est...",
    answers: [
      { id: 'a', text: "Hétérogène", isCorrect: false },
      { id: 'b', text: "Homogène", isCorrect: true },
      { id: 'c', text: "Solide", isCorrect: false }
    ],
    explanation: "L'eau et le sirop forment un mélange homogène, on ne distingue plus les constituants (Diapo 16)."
  },
  {
    id: 4,
    text: "Le mélange Eau + Huile est...",
    answers: [
      { id: 'a', text: "Homogène", isCorrect: false },
      { id: 'b', text: "Hétérogène", isCorrect: true },
      { id: 'c', text: "Gazeux", isCorrect: false }
    ],
    explanation: "L'eau et l'huile ne se mélangent pas, c'est hétérogène (Diapo 16)."
  },
  {
    id: 5,
    text: "Dans l'eau salée, le sel est...",
    answers: [
      { id: 'a', text: "Le solvant", isCorrect: false },
      { id: 'b', text: "La solution", isCorrect: false },
      { id: 'c', text: "Le soluté", isCorrect: true }
    ],
    explanation: "La substance qui se dissout est le soluté (Diapo 23)."
  },
  {
    id: 6,
    text: "Dans l'eau salée, l'eau est...",
    answers: [
      { id: 'a', text: "Le solvant", isCorrect: true },
      { id: 'b', text: "Le soluté", isCorrect: false },
      { id: 'c', text: "Le mélange", isCorrect: false }
    ],
    explanation: "Le liquide qui dissout la substance est le solvant (Diapo 24)."
  },
  {
    id: 7,
    text: "Le mélange homogène obtenu après dissolution s'appelle...",
    answers: [
      { id: 'a', text: "La solution", isCorrect: true },
      { id: 'b', text: "Le solvant", isCorrect: false },
      { id: 'c', text: "Le soluté", isCorrect: false }
    ],
    explanation: "Le résultat de la dissolution est la solution (Diapo 25)."
  },
  {
    id: 8,
    text: "Si le solvant est l'eau, la solution est dite...",
    answers: [
      { id: 'a', text: "Aqueuse", isCorrect: true },
      { id: 'b', text: "Liquide", isCorrect: false },
      { id: 'c', text: "Huilée", isCorrect: false }
    ],
    explanation: "Une solution dont le solvant est l'eau est une solution aqueuse (Diapo 40)."
  },
  {
    id: 9,
    text: "Dans une boisson gazeuse, le gaz est...",
    answers: [
      { id: 'a', text: "Le solvant", isCorrect: false },
      { id: 'b', text: "Le soluté", isCorrect: true },
      { id: 'c', text: "La solution", isCorrect: false }
    ],
    explanation: "Le gaz est dissous dans l'eau, c'est donc le soluté (Diapo 52)."
  },
  {
    id: 10,
    text: "Dans un chocolat chaud, l'eau chaude est...",
    answers: [
      { id: 'a', text: "Le soluté", isCorrect: false },
      { id: 'b', text: "Le solvant", isCorrect: true },
      { id: 'c', text: "La poudre", isCorrect: false }
    ],
    explanation: "L'eau chaude dissout la poudre, c'est le solvant (Diapo 56)."
  }
];