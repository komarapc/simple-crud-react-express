import { useState } from "react";

const boards = Array(9).fill(null);

export default function TicTacToe() {
  const [cunrrentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState("");
  console.log({ boards });
  const checkWinner = () => {
    const winnerCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    winnerCombinations.forEach((combination) => {
      const [a, b, c] = combination;
      if (boards[a] && boards[a] === boards[b] && boards[a] === boards[c]) {
        setWinner(boards[a]);
        console.log("Winner is", boards[a]);
      }
    });
  };

  return (
    <>
      <div className="container mx-auto max-w-2xl  p-10 flex flex-col items-center justify-center">
        <div>
          <h1 className="text-4xl font-bold text-center">Tic Tac Toe</h1>
          <h2 className="text-2xl font-bold text-center">
            {cunrrentPlayer} turn
          </h2>
          {winner && (
            <h2 className="text-2xl font-bold text-center">{winner} won</h2>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-10">
          {boards.map((value, index) => (
            <div
              key={index}
              className="bg-blue-500 h-20 flex justify-center items-center text-4xl aspect-square cursor-pointer rounded-md hover:scale-105 transition-transform ease-in-out duration-200"
              onClick={() => {
                if (value === null && !winner) {
                  boards[index] = cunrrentPlayer;
                  setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
                  checkWinner();
                }
              }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
