"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const GameModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    let animationFrameId;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let dx = 1;
    let dy = 0;
    let speed = 10;
    let lastRenderTime = 0;
    const gridSize = 20;

    const generateFood = () => {
      food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize)),
      };

      snake.forEach((segment) => {
        if (segment.x === food.x && segment.y === food.y) {
          generateFood();
        }
      });
    };

    const checkEatFood = () => {
      const head = snake[0];
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        generateFood();
        return true;
      }
      return false;
    };

    const checkCollision = () => {
      const head = snake[0];
      if (
        head.x < 0 ||
        head.x >= canvas.width / gridSize ||
        head.y < 0 ||
        head.y >= canvas.height / gridSize
      ) {
        return true;
      }
      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          return true;
        }
      }
      return false;
    };

    const moveSnake = () => {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      snake.unshift(head);

      if (checkCollision()) {
        setGameOver(true);
        return;
      }

      if (!checkEatFood()) {
        snake.pop();
      }
    };

    const draw = (timestamp) => {
      if (timestamp - lastRenderTime < 1000 / speed) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastRenderTime = timestamp;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0ff";
      snake.forEach((segment, index) => {
        if (index === 0) ctx.fillStyle = "#ff0";
        ctx.fillRect(
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize,
          gridSize
        );
        ctx.strokeStyle = "#f0f";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize,
          gridSize
        );
        if (index === 0) ctx.fillStyle = "#0ff";
      });

      ctx.fillStyle = "#f0f";
      ctx.shadowColor = "#f0f";
      ctx.shadowBlur = 10;
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width / gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height / gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      if (!gameOver) {
        moveSnake();
        animationFrameId = requestAnimationFrame(draw);
      } else {
        ctx.fillStyle = "#ff0";
        ctx.font = "30px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px monospace";
        ctx.fillText(
          `Score: ${score}`,
          canvas.width / 2,
          canvas.height / 2 + 40
        );
        ctx.fillText(
          "Press SPACE to restart",
          canvas.width / 2,
          canvas.height / 2 + 80
        );
      }
    };

    generateFood();
    animationFrameId = requestAnimationFrame(draw);

    const handleKeyDown = (e) => {
      if (gameOver && e.code === "Space") {
        snake = [{ x: 10, y: 10 }];
        dx = 1;
        dy = 0;
        generateFood();
        setScore(0);
        setGameOver(false);
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      switch (e.code) {
        case "ArrowUp":
          if (dy !== 1) {
            dx = 0;
            dy = -1;
          }
          break;
        case "ArrowDown":
          if (dy !== -1) {
            dx = 0;
            dy = 1;
          }
          break;
        case "ArrowLeft":
          if (dx !== 1) {
            dx = -1;
            dy = 0;
          }
          break;
        case "ArrowRight":
          if (dx !== -1) {
            dx = 1;
            dy = 0;
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, gameOver]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="game-modal">
        <div className="modal-header">
          <h2>Cyber Snake</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="game-container">
          <div className="game-score">Score: {score}</div>
          <canvas ref={canvasRef} className="game-canvas" />
          <div className="game-instructions">
            <p>Use arrow keys to control the snake.</p>
            <p>Collect the neon food to grow.</p>
            {gameOver && <p>Press SPACE to restart.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
