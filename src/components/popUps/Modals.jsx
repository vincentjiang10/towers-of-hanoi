import React, { useState, useRef } from "react";
import useSound from "use-sound";
import 'antd/dist/antd.css';
import { Carousel } from "antd";
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaGripLines,
  FaGripLinesVertical,
  FaPlay,
  FaPause,
  FaRedo,
  FaGithub
} from "react-icons/fa";
import { IoMdHelp, IoMdMore, IoMdInformationCircleOutline } from "react-icons/io";
import { AiFillPicture, AiTwotoneEdit } from "react-icons/ai";

// styling for content
const contentStyle = {
  height: "450px",
  color: "#fff",
  lineHeight: "30px",
  background: "#1d1d1d",
  border: "thin solid lightseagreen"
};

// styling for icons 
const iconStyle = {
  fontSize: "1.2em",
  color: "lightseagreen",
  verticalAlign: "middle",
}

// styling for sections
const sectionStyle = {
  lineHeight: "20px",
  padding: "5px 20px",
  margin: "10px 5px",
  border: "thin dotted lightseagreen",
  background: "#364d79",
  borderRadius: "10px"
}

// styling for images
const imageStyle = {
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  padding: "10px 10px",
  width: "50%"
}

// styling for arrows
const arrowStyle = {
  color: "LightSeaGreen",
  size: "2em"
}

// Introduction modal (called on screen refresh and by user calling help button)
export const IntroModal = ({ opaque }) => {
  const [click] = useSound(`${process.env.PUBLIC_URL}/assets/sounds/click.mp3`);
  const carousel = useRef(null);
  const [arrowDisabled, setArrowDisabled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // sets cooldown for arrows
  const setCooldown = () => {
    const cooldown = async () => {
      await new Promise(() => {
        setTimeout(() => { setArrowDisabled(false) }, 1000);
      });
    }
    setArrowDisabled(true);
    click();
    cooldown();
  }

  return (
    <div className="introModal">
      <Carousel
        ref={carousel}
        infinite={false}
        beforeChange={(current, next) => setCurrentSlide(next)}
      >
        <div>
          <div style={contentStyle}>
            <br />
            <div className="heading">Welcome to Towers of Hanoi!</div>
            <div className="body">
              <div style={sectionStyle}>
                This web app game is based on the classic math puzzle: Towers of Hanoi.
              </div>
              <div style={sectionStyle}>
                Common rules and objectives include: <br />
                <ul>
                  <li>Never moving a larger disk on top of a smaller one</li>
                  <li>Only moving one disk at a time</li>
                  <li>Move all disks from the source (<FaChevronUp style={iconStyle} />) tower to the destination (<FaChevronDown style={iconStyle} />) tower</li>
                </ul>
              </div>
              <div style={sectionStyle}>
                This short tutorial will introduce this application's features and how to use it. <br />
                You may traverse this modal using the arrows on the side or the bars below.
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <br />
            <div className="heading">Features</div>
            <div className="body">
              <div style={sectionStyle}>You can interact with the puzzle with the aid of animation, sounds, and other effects.</div>
              <div style={sectionStyle}>
                On the sidebar, you can choose: <br />
                <ul>
                  <li>The <b>puzzle rules</b> (<IoMdMore size="1.2em" style={iconStyle} />) and type</li>
                  <li>The number of <b>towers</b> (<FaGripLinesVertical style={iconStyle} />) and <b>disks</b> (<FaGripLines style={iconStyle} />) to be set</li>
                  <li>The <b>source</b> (<FaChevronUp style={iconStyle} />) and <b>destination</b> (<FaChevronDown style={iconStyle} />) towers</li>
                  <li>The <b>background theme</b> (<AiFillPicture style={iconStyle} />) and <b>material</b> (<AiTwotoneEdit style={iconStyle} />)</li>
                  <li>To <b>animate</b> (<FaPlay size="0.7em" style={iconStyle} />)</li>
                </ul>
              </div>
              <div style={sectionStyle}>
                In <b>Rules and Variants</b> (<IoMdMore size="1.2em" style={iconStyle} />), hover over the info (<IoMdInformationCircleOutline size="1.2em" style={iconStyle} />)
                icons to take a look at the rules for each puzzle.
                Hovering over each item in the sidebar will offer a description of usage.
                <b> Reset</b> (<FaRedo size="0.8em" style={iconStyle} />) will enable you to reset the puzzle to the original state.
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <br />
            <div className="heading">Interaction and Animation</div>
            <div className="body">
              <div style={sectionStyle}>
                You can move a disk by dragging it up out of the tower and into the nearest tower.
              </div>
              <div style={sectionStyle}>
                <b>Animate</b> (<FaPlay size="0.7em" style={iconStyle} />) supports two types of disk animations: <br />
                <ul>
                  <li>Moving the disks on pause, which moves one disk at a time by clicking forward (<FaChevronRight style={iconStyle} />) or backward (<FaChevronLeft style={iconStyle} />)</li>
                  <li>Moving the disks on play, which plays the solution animation</li>
                </ul>
                <b>Note: Animate</b> (<FaPlay size="0.7em" style={iconStyle} />) is currently only available for puzzles with 3 towers.
              </div>
              <div style={sectionStyle}>
                <b>Animate</b> (<FaPlay size="0.7em" style={iconStyle} />) toggle options: <br />
                <ul>
                  <li>Clicking on the <FaPlay size="0.7em" style={iconStyle} /> / <FaPause size="0.7em" style={iconStyle} /> icon </li>
                  <li>Clicking anywhere will pause if on play</li>
                  <li>Using the spacebar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <br />
            <div className="heading">Levels and Signing In</div>
            <div className="body">
              <div style={sectionStyle}>
                You may choose to sign in with Google on the top right. <br />
                <img src={`${process.env.PUBLIC_URL}/assets/images/signIn.jpg`} alt="sign in and levels" style={imageStyle} />
                This will enable <b>Levels</b> to store the levels you have completed and the number of moves you used to complete the levels.
                The puzzle levels shown will depend on the selected puzzle in <b>Rules and Variants</b> (<IoMdMore size="1.2em" style={iconStyle} />).<br />
                <br />
                <b> Note:</b> The use of <b>Animate</b> (<FaPlay size="0.7em" style={iconStyle} />) will not count towards level completion: A level can only be completed by manually dragging the disks.
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <br />
            <div className="heading">Enjoy!</div>
            <div className="body">
              <div style={sectionStyle}>
                Restart this tutorial anytime by clicking the <b>Help</b> (<IoMdHelp style={iconStyle} />) option on the sidebar. <br />
                You can also view the source code for this project by clicking <b>View Source</b> (<FaGithub style={iconStyle} />).
              </div>
            </div>
          </div>
        </div>
      </Carousel>
      {currentSlide > 0 && (
        <FaChevronLeft className="leftArrow"
          {...arrowStyle}
          style={opaque(arrowDisabled)}
          onClick={() => {
            carousel.current.prev();
            setCooldown();
          }}
        />
      )}
      {currentSlide < 4 && (
        <FaChevronRight className="rightArrow"
          {...arrowStyle}
          style={opaque(arrowDisabled)}
          onClick={() => {
            carousel.current.next();
            setCooldown();
          }}
        />
      )}
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
        style={{ bottom: "475px" }}
      >
        &times;
      </div>
    </div>
  )
}

// Modal called on puzzle solution
export const WinModal = () => {
  const [click] = useSound(`${process.env.PUBLIC_URL}/assets/sounds/click.mp3`);

  return (
    <div className="winModal">
      <div style={contentStyle}>
        <br />
        <div className="heading">
          You have solved a puzzle level!
        </div>
        <div className="body">
          <div style={sectionStyle}>
            Feel free to navigate the sidebar to set another puzzle configuration or click <b>Reset </b>
            (<FaRedo size="0.8em" style={iconStyle} />) to reset the current puzzle.
            Click on <b>Levels</b> on the top right corner to try another level
            (if you are signed in and have not used <b>Animate</b> (<FaPlay size="0.7em" style={iconStyle} />) for this level, you should see the updated number of moves for the current level).
            You can also switch the puzzle type in <b>Rules and Variants </b>
            (<IoMdMore size="1.2em" style={iconStyle} />).
          </div>
        </div>
      </div>
      <div className="close"
        onClick={() => {
          const closeModal = async () => {
            await new Promise(() => {
              setTimeout(() => {
                document.getElementsByClassName("overlay")[0].style.display = "none";
                document.getElementsByClassName("winModal")[0].style.display = "none";
                click();
              }, 0);
            });
          }
          closeModal();
        }}
        style={{ bottom: "445px" }}
      >
        &times;
      </div>
    </div>
  )
}

// Loading modal for tracking game loading progress
export const LoadingModal = ({ progress, status }) => {
  return (
    <div className="loadingModal">
      <div style={contentStyle}>
        <br />
        <div className="heading">Loading Game</div>
        <div className="body">
          <div style={sectionStyle}>
            {status}
          </div>
          <div className="progressBar">
            <div
              className="progressBarFill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progressText">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}