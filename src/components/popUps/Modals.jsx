import React, { useState, useRef } from "react";
import useSound from "use-sound";
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
  const [click] = useSound(`${process.env.PUBLIC_URL}/assets/sounds/click.mp3`);
  const carousel = useRef(null);
  const [arrowDisabled, setArrowDisabled] = useState(false);

  const setCooldown = () => {
    const cooldown = async () => {
			await new Promise(() => {
				setTimeout(() => {setArrowDisabled(false)}, 1000);
			});
		}
    setArrowDisabled(true);
    click();
    cooldown();
  }

  const contentStyle = {
    height: "400px",
    color: "#fff",
    lineHeight: "30px",
    textAlign: "center",
    background: "#364d79"
  };

  const arrowStyle = {
    color: "LightSeaGreen",
    size: "2em"
  }
  
  return (
    <>
      <Carousel ref={carousel} infinite={false}>
        <div>
          <div style={contentStyle}>
            <br />
            <div>Welcome to Towers of Hanoi!</div>
            <div>
              Test
            </div>
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <br />
            <div>2</div>
            <div>
              Test
            </div>
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <br />
            <div>3</div>
            <div>
              Test
            </div>
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <br />
            <div>4</div>
            <div>
              Test
            </div>
          </div>
        </div>
      </Carousel>
      <FaChevronLeft className="leftArrow" 
        {...arrowStyle} 
        style={opaque(arrowDisabled)}
        onClick={() => {
          carousel.current.prev();
          setCooldown();
        }}
      />
      <FaChevronRight className="rightArrow"
        {...arrowStyle}
        style={opaque(arrowDisabled)}
        onClick={() => {
          carousel.current.next();
          setCooldown();
        }} 
      />
      <div className="close" 
        onClick={() => {
          const closeModal = async () => {
            await new Promise(() => {
              setTimeout(() => {
                document.getElementsByClassName("introModal")[0].style.display = "none";
                document.getElementsByClassName("overlay")[0].style.display = "none";
                click();
              }, 0);
            });
          }
          carousel.current.goTo(0, true);
          closeModal();
        }}
      >
        &times;
      </div>
    </>
  )
}