import React, { useState, useRef } from "react";
import 'antd/dist/antd.css';
import { Carousel } from "antd";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Main modal carousel should be called on screen refresh and by user calling help button
// Figure out how closing a modal works
// Clicking on rules and variants choice should open modal explaining rules (with animation: self-recorded)

// Things to include potentially:
/**
 *  1. Introduction message
 *    - what this app does (it's purpose) : be quick!!
 *    - how to use this app? (How to move the disks)
 *  2. Signing in features 
 *    - talk about what features are available on sign-in: best-time, # of moves, other stats
 *  3. Quick slide on features
 *    - hovering over items will produce popUp (modeless) after 1 second delay
 *    - animation supports frequent pause and play: feel free to switch between animation and manual dragging
 */

export const IntroModal = ({ opaque }) => {
  const carousel = useRef(null);
  const slideIndex = useRef(0);
  const [arrowDisabled, setArrowDisabled] = useState(false);

  const setCooldown = () => {
    const cooldown = async () => {
			await new Promise(() => {
				setTimeout(() => {setArrowDisabled(false)}, 1000);
			});
		}
    setArrowDisabled(true);
    cooldown();
  }

  const contentStyle = {
    height: "400px",
    color: "#fff",
    lineHeight: "200px",
    textAlign: "center",
    background: "#364d79"
  };

  const arrowStyle = {
    color: "LightSeaGreen",
    size: "2em"
  }
  
  return (
    <>
      <Carousel ref={carousel}>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
      <FaChevronLeft className="leftArrow" 
        {...arrowStyle} 
        style={opaque(arrowDisabled)}
        onClick={() => {
          if (slideIndex.current > 0) {
            carousel.current.prev();
            slideIndex.current--;
            setCooldown();
          }
        }} 
      />
      <FaChevronRight className="rightArrow"
        {...arrowStyle}
        style={opaque(arrowDisabled)}
        onClick={() => {
          if (slideIndex.current < 3) {
            carousel.current.next();
            slideIndex.current++;
            setCooldown();
          }
        }} 
      />
    </>
  )
}