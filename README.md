# Towers of Hanoi

## Project Description
This project was inspired by and based on the Towers of Hanoi puzzle and its variants. The recursive nature of the towers puzzle motivated me to create this web application to animate, visualize, and interact with the different puzzle configurations. You can visit the site [here](https://towers-of-hanoi-4d72b.web.app/). Google Chrome is recommended. 

## Puzzle Types and Rules
### Standard
**Rules:**
1. Larger disks cannot be placed on top of smaller disks
2. Only one disk can be moved at the time, the topmost disk at a tower

**Objectives:**
1. Move all disks from the source tower to the destination tower

**Preview:**
![Standard Solution Animation](gifs/StandardAnimation.gif)

---
### Bicolor
**Rules:**
1. Larger disks cannot be placed on top of smaller disks (Same size disks can)
2. Only one disk can be moved at the time, the topmost disk at a tower 

**Objectives:**
1. Separate the total number of disks evenly, half on the source tower and half on the destination tower
2. Make both towers monochrome: cyan for source tower and light blue for tower

**Preview:**
![Bicolor Solution Animation](gifs/BicolorAnimation.gif)

---
### Adjacent
**Rules:**
1. Larger disks cannot be placed on top of smaller disks
2. Only one disk can be moved at the time, the topmost disk at a tower
3. In a single move, a disk can only be moved to an adjacent tower

**Objectives:**
1. Move all disks from the source tower to the destination tower

**Preview:**
![Adjacent Solution Animation](gifs/AdjacentAnimation.gif)

## Features
The application contains many features, including changing the **puzzle type and rules**, setting the **number of towers and disks**, and changing the **source tower** (the starting tower for disks) and **destination tower**. Other miscellaneous options include changing the **background theme** and the rendered **material** for the disks and towers. The **animation** feature allows you to visualize the recursive behavior of the puzzle solution. You can animate moves one at a time or simply let the solution animation play all the moves at a preffered rate. There is also a **levels** feature when signing in with Google in the application, which allows you to choose different puzzle levels and complete them. 

## Technologies
This web app is created primarly with [React](https://reactjs.org/) functional components, coded in JavaScript and some HTML / CSS. 3D rendering of the puzzle towers and disks is accomplished using [react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) (a React renderer for [Three.js](https://threejs.org/)). Animation and UI employed the [react-spring](https://react-spring.dev/) animation library coupled with [use-gesture](https://use-gesture.netlify.app/), a React Hook library. This app is hosted and deployed through [Firebase](https://firebase.google.com/), which is also used for user authentication through Google sign-in and to store game data.
