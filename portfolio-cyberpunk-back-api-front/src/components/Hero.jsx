"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    const text = [
      { command: "init_cyber_connection", response: "Initializing..." },
      {
        command: "scan_network",
        response: "Network scan complete. Welcome to the digital frontier.",
      },
      {
        command: "load_profile",
        response: "Profile loaded: Thibaut, Web Developer.",
      },
      {
        command: "run_introduction.exe",
        response: "Ready to explore my digital realm?",
      },
      {
        command: "run_easteregg.exe",
        response: "Don't click on the dead pixel (cta)",
      },
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let isCommand = true;

    const outputElement = document.createElement("div");
    outputElement.className = "terminal-output";
    terminal.appendChild(outputElement);

    const promptElement = document.createElement("div");
    promptElement.className = "terminal-prompt";
    promptElement.innerHTML =
      '<span class="terminal-user">user@cyberpunk:~$</span> ';
    const cmdElement = document.createElement("span");
    cmdElement.className = "terminal-cmd";
    promptElement.appendChild(cmdElement);
    terminal.appendChild(promptElement);

    const cursorElement = document.createElement("span");
    cursorElement.className = "terminal-cursor";
    cursorElement.textContent = "█";
    promptElement.appendChild(cursorElement);

    const typeText = () => {
      if (lineIndex < text.length) {
        const currentLine = text[lineIndex];
        const currentText = isCommand
          ? currentLine.command
          : currentLine.response;

        if (charIndex < currentText.length) {
          if (isCommand) {
            cmdElement.textContent += currentText.charAt(charIndex);
          } else {
            outputElement.textContent += currentText.charAt(charIndex);
          }
          charIndex++;
          setTimeout(typeText, Math.random() * 50 + 20);
        } else {
          if (isCommand) {
            isCommand = false;
            charIndex = 0;
            outputElement.textContent = "";
            setTimeout(typeText, 500);
          } else {
            const newOutput = document.createElement("div");
            newOutput.className = "terminal-output";
            newOutput.textContent = currentLine.response;
            if (promptElement.parentNode === terminal) {
              terminal.insertBefore(newOutput, promptElement);
            }
            outputElement.textContent = "";
            cmdElement.textContent = "";
            lineIndex++;
            charIndex = 0;
            isCommand = true;

            if (lineIndex < text.length) {
              setTimeout(typeText, 1000);
            } else {
              cursorElement.classList.add("terminal-cursor-blink");
            }
          }
        }
      }
    };

    setTimeout(typeText, 1000);

    return () => {
      while (terminal.firstChild) {
        terminal.removeChild(terminal.firstChild);
      }
    };
  }, []);

  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="glitch-container">
              <h1 className="glitch-text" data-text={`${t("hero.greeting")}`}>
                {t("hero.greeting")}
              </h1>
            </div>
            <h2 className="hero-name">{t("hero.name")}</h2>
            <h3 className="hero-title">{t("hero.title")}</h3>
            <p className="hero-description">{t("hero.description")}</p>
            <div className="hero-cta">
              <Link href="/projects" className="neon-button">
                {t("hero.cta")}
              </Link>
            </div>
          </div>

          <div className="hero-terminal">
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="terminal-button"></span>
                <span className="terminal-button"></span>
                <span className="terminal-button"></span>
              </div>
              <div className="terminal-title">cyberpunk.terminal</div>
            </div>
            <div className="terminal-body" ref={terminalRef}></div>
          </div>
        </div>
      </div>

      <div className="hero-background">
        <div className="cyberpunk-grid"></div>
        <div className="neon-overlay"></div>
      </div>
    </section>
  );
};

export default Hero;
