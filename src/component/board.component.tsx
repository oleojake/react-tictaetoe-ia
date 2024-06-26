import React, { useEffect } from "react";
import classes from "./board.component.module.css";
import { Square } from "./square.component";
import { calculateWinner } from "./helpers";
import { ContainerInfoTurn } from "./container-infoTurn.component";
import { isAIPlaying, isAITurn } from "../core/gamestatus/motor";
import { AIMove, OpenAIMove } from "../core/AI/motor";
import { MODE } from "../core/gamestatus";

interface Props {
	currentGameMode: string;
}

export const Board: React.FC<Props> = (props) => {
	const [turn, setTurn] = React.useState(true);
	const [squares, setSquares] = React.useState(Array(9).fill(null));
	const { currentGameMode } = props;

	useEffect(() => {
		if (isAIPlaying(currentGameMode) && isAITurn(turn)) {
			if (currentGameMode === MODE.AI_CHATGPT) {
				const fetchData = async () => {
					try {
						const squareIndex = await OpenAIMove(squares);
						handlePlay(squareIndex);
					} catch (error) {
						console.error(error);
					}
				};
				fetchData();
			} else {
				const squareIndex = AIMove(currentGameMode, squares);
				setTimeout(() => {
					handlePlay(squareIndex);
				}, 300);
			}
		}
	}, [turn]);

	useEffect(() => {
		restartGame();
	}, [currentGameMode]);

	const restartGame = () => {
		const nextSquares = Array(9).fill(null);
		setSquares(nextSquares);
		setTurn(true);
	};

	const handlePlay = (id: number) => {
		if (squares[id] || calculateWinner(squares)) {
			return;
		}

		const nextSquares = squares.slice();
		turn ? (nextSquares[id] = "✕") : (nextSquares[id] = "〇");

		setSquares(nextSquares);
		setTurn(!turn);
	};

	return (
		<div className={classes.game}>
			<h1 className={classes.header}>React TicTaeToe</h1>
			<div className={classes.boardContainer}>
				{squares.map((square, index) => (
					<Square
						currentGameMode={currentGameMode}
						key={index}
						id={index}
						value={square}
						turn={turn}
						onClick={handlePlay}
					/>
				))}
			</div>
			<ContainerInfoTurn infoSquares={squares} turn={turn} onClick={restartGame} />
		</div>
	);
};
