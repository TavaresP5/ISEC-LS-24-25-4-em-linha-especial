# ISEC-LS-24-25-4-em-linha-especial
**Course:** Scripting Languages
**Institution:** Coimbra Superior Institute of Engineering (ISEC)
**Academic Year:** 2024/2025

## Project Overview
This project involves the development and implementation of an interactive web-based game strategy solution using React JS. The primary objective is to apply modern web development concepts, specifically functional components and hooks, to create a robust version of the classic "Connect 4" game.

The project follows a component-based architecture, emphasizing code reusability, state management, and user interface responsiveness. It evolves from standard game logic to include advanced constraints and dynamic events that enhance the strategic depth of the application.

## System Scope and Functionality
The application is designed to address the following core requirements and features:

1. Game Mechanics and Modes
The system facilitates the core gameplay loop of a strategy board game while introducing versatile game modes.
* **Versus Modes:** Support for local Player vs. Player (PvP) matches with custom name entry.
* **Bot Integration:** Implementation of a single-player mode against a computer opponent (Bot) that executes randomized moves.
* **Logic Validation:** Automated detection of victory conditions (horizontal, vertical, diagonal) and draw states.

2. Time and Strategic Constraints
The system imposes specific rules to increase difficulty and game pacing.
* **Pressure Timer:** Implementation of a strict countdown timer (10 seconds) per turn. The system automatically forces a turn switch if the player fails to act within the limit.
* **Special Cells:** Random generation of five "Special Slots" on the board at the start of the match. Placing a token in these specific coordinates grants the player an immediate extra turn.

3. User Interface and Visual Feedback
The application focuses on a seamless user experience through visual cues and native animations.
* **Physics Simulation:** CSS-based animation logic to simulate the gravity of tokens sliding down columns without the use of external animation libraries.
* **Interactive Feedback:** Real-time visual indicators such as column highlighting on hover, victory notifications, and a dynamic scoreboard tracking wins and move history.

## Technical Structure
This repository contains the source code and component logic developed for the assignment:

* **Board Component (Board.jsx):** Acts as the central controller, managing the application state, including the 2D array representation of the grid, current player turn, timer logic, and bot behavior.
* **Slot Component (Slot.jsx):** Represents the individual atomic units of the grid, responsible for rendering the correct token assets (Red/Black) and identifying special bonus cells.
* **Style and Animation (App.css):** Contains the visual definitions and keyframe animations required for the fluid movement of game pieces.

## Authors
* André Tavares
* Rodrigo Ideia
* Gonçalo Bento
