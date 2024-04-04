import TicTacToe from "@/pages/TicTacToe";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tic-tac-toe")({
  component: TicTacToe,
});
