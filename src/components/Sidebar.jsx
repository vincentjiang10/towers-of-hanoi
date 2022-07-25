import React, { useState, useEffect } from "react";
import { 
	ProSidebar, 
	SidebarHeader, 
	SidebarContent, 
	SidebarFooter, 
	Menu, 
	MenuItem, 
	SubMenu 
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Slider } from "@mui/material";
import { IconContext } from "react-icons";
import { 
	FaCog, 
	FaGripLinesVertical, 
	FaPlay, 
	FaPause, 
	FaGripLines, 
	FaChevronUp, 
	FaChevronDown,
	FaRedo, 
	FaGithub
} from "react-icons/fa";
import { AiOutlineCaretRight, AiFillPicture, AiTwotoneEdit } from "react-icons/ai";
import { TbTallymark1 } from "react-icons/tb";
import { IoMdHelp, IoMdMore, IoMdInformationCircleOutline } from "react-icons/io";
import Tippy, { useSingleton } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {
	RulesTooltip, 
	ProcedureTooltip,
	TowerTooltip, 
	DiskTooltip, 
	SourceTooltip, 
	DestTooltip, 
	ThemeTooltip, 
	MaterialTooltip, 
	AnimateTooltip 
} from "./popUps/Tooltips"
import GameLogic from "./GameLogic";

const Sidebar = ({images, onBackgroundChange}) => {
	// separate state for rendering options
	const [collapse, setCollapse] = useState(false);
	const [procedure, setProcedure] = useState(0);
	const [numTowers, setNumTowers] = useState(3);
	const [numDisks, setNumDisks] = useState(3);
	const [source, setSource] = useState(0);
	const [destination, setDestination] = useState(numTowers-1);
	const textures = ["metal", "granite", "wood", "stone"];
	const [texture, setTexture] = useState(Math.floor(textures.length * Math.random()));
	const [animate, setAnimate] = useState(false);
	const [playRate, setPlayRate] = useState(1);
	const [src, target] = useSingleton();

	// resets gameState
	const reset = () => {
		const delaySet = async (source) => {
			await new Promise(() => {
				setTimeout(() => {setSource(source)}, animate ? 1000 : 500);
			});
		}
		// set out of bounds to avoid collision with destination
		setAnimate(false);
		setSource(-2);
		delaySet(source);
	}

	// rerenders gameState (solution to rendering error when setting Disk positions)
	useEffect(() => {
		// TODO: call alert whenever gameState is about to be reset (perhaps insider the function call to reset())
		reset();
	}, [numDisks, numTowers, procedure]);

	useEffect(() => {
		setAnimate(false);
	}, [source, destination])

	// toggles animate on spacebar
	window.onkeyup = (event) => {event.code === "Space" && setAnimate(!animate)};

	// common slider props
	const sliderProps = {
		getAriaValueText: (value) => value,
		valueLabelDisplay: "auto",
		size: "small",
		step: 1,
		marks: true,
		min: 3,
		max: 7
	};

	// produces tower item containing tower icons 
	const towerItem = (dir, set) => (
		<div className="towerItem">
			{/* tower icons generation, loops through array of length numTowers */
				[...Array(numTowers)].map((_, index) => 
					<span className="towerIcon" 
						key={index}
						style={{ 
							background: `linear-gradient(transparent 50%, ${index === dir ? "DeepSkyBlue" : "Cyan"} 50%` 
						}}
						onClick={() => {index !== source && index !== destination && set(index)}}
					>
						<TbTallymark1 
							color={index === dir ? "RoyalBlue" : "LightSeaGreen"}
							size={35}
						/>
					</span>
				)
			}
		</div>
	);

	// array containing string elements representing choices for different types of game rules/procedures
	const procedures = ["Standard", "Bicolor", "Adjacent"];

	return (
		<>
			<ProSidebar collapsed={collapse}>
				<IconContext.Provider className="sidebar" value={{ color: "LightSeaGreen" }}>
					<SidebarHeader>
						<Menu iconShape="circle">
							<MenuItem icon={<FaCog />} onClick={() => {setCollapse(!collapse)}}>
								OPTIONS
							</MenuItem>
						</Menu>
					</SidebarHeader>
					<SidebarContent>
						{/* used as the tippy singleton */}
						<Tippy singleton={src} placement="right" delay={500} />
						<Menu iconShape="circle">
							<SubMenu 
								title={<Tippy content={<RulesTooltip />} singleton={target}><div>Rules and Variants</div></Tippy>}
								icon={<IoMdMore size="1.5em" />}
							>
								{procedures.map((option, index) => 
									<MenuItem
										key={option}
										icon={index === procedure && <AiOutlineCaretRight />}
										style={{ color: index === procedure ? "LightSeaGreen" : "#ADADAD" }} 
										onClick={() => {setProcedure(index)}}
									>
										<div className="ruleItem">
											{option}
											<Tippy content={<ProcedureTooltip procedure={index} />} singleton={target}>
												<span><IoMdInformationCircleOutline size="1.5em" /></span>
											</Tippy>
										</div>
									</MenuItem>
								)}
							</SubMenu>
							<SubMenu 
								title={<Tippy content={<TowerTooltip />} singleton={target}><div>Number of Towers</div></Tippy>}
								icon={<FaGripLinesVertical />}
							>
								<div className="sliderWrapper" style={{ paddingTop: collapse && 20 }}> 
									<Slider
										{...sliderProps}
										value={numTowers}
										onChangeCommitted={(_, newVal) => {
											setNumTowers(newVal)
											setSource(0);
											setDestination(newVal-1);
										}}
									/>
								</div>
							</SubMenu>
							<SubMenu 
								title={<Tippy content={<DiskTooltip />} singleton={target}><div>Number of Disks</div></Tippy>}
								icon={<FaGripLines />}
							>
								<div className="sliderWrapper" style={{ paddingTop: collapse && 20 }}>
									<Slider
										{...sliderProps}
										value={numDisks}
										onChangeCommitted={(_, newVal) => {setNumDisks(newVal)}}
									/>
								</div>
							</SubMenu>
							<SubMenu 
								title={<Tippy content={<SourceTooltip />} singleton={target}><div>Source Tower</div></Tippy>} 
								icon={<FaChevronUp />}
							>
								{towerItem(source, setSource)}
							</SubMenu>
							<SubMenu 
								title={<Tippy content={<DestTooltip />} singleton={target}><div>Destination Tower</div></Tippy>}
								icon={<FaChevronDown />}
							>
								{towerItem(destination, setDestination)}
							</SubMenu>
							<SubMenu 
								title={<Tippy content={<ThemeTooltip />} singleton={target}><div>Theme</div></Tippy>}
								icon={<AiFillPicture />}
							>
								{images.map((image, index) => 
									<MenuItem className="themeItem" 
										key={image} 
										style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/${images[index]}.jpg)` }} 
										onClick={() => {onBackgroundChange(index)}}
									>		
										{image[0].toUpperCase() + image.substring(1)}
									</MenuItem>
								)}
							</SubMenu>
							<SubMenu 
								title={<Tippy content={<MaterialTooltip />} singleton={target}><div>Material</div></Tippy>}
								icon={<AiTwotoneEdit />}
							>
								{textures.map((image, index) => 
									<MenuItem className="materialItem"
										key={image}
										style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/textures/${textures[index]}/preview.jpg)` }}
										onClick={() => {setTexture(index)}}
									/>
								)}
							</SubMenu>
							{animate ? 
								// if animate, attach additional menuItem containing rate slider
								<SubMenu 
									title={<Tippy content={<AnimateTooltip />} singleton={target}><div>Animate</div></Tippy>}
									icon={<FaPause onClick={() => {setAnimate(false)}} />}
									// only responds to clicking parent component (seen as icon) upon collapsed sidebar
									onClick={(event) => {
										collapse && event.target === event.currentTarget && setAnimate(false)
									}}
									// solution animation only available for numTowers === 3
									style={numTowers > 3 ? {pointerEvents: "none", opacity: "0.4"} : {}}
								>
									<span>Play Rate</span>
									<div className="sliderWrapper">
										<Slider
											getAriaValueText={(value) => value}
											value={playRate < 1 ? 2-1/playRate: playRate}
											step={0.01}
											min={0}
											max={2}
											// slider values goes from 0 (mapping to 50%) all the way to 2 (mapping to 200%)
											marks={[{value: 0, label: <span style={{ color: "#ADADAD" }}>50%</span>}, 
															{value: 1, label: <span style={{ color: "#ADADAD" }}>100%</span>}, 
															{value: 2, label: <span style={{ color: "#ADADAD" }}>200%</span>}]}
											// if newVal is less than 1, then set play rate to 1/(2-newVal), else set to newVal
											onChangeCommitted={(_, newVal) => {setPlayRate(newVal < 1 ? 1/(2-newVal) : newVal)}}
										/>
									</div>
								</SubMenu>
								:
								// if !animate, render icon only
								<MenuItem 
									icon={<FaPlay />} 
									onClick={() => {setAnimate(true)}} 
									style={numTowers > 3 ? {pointerEvents: "none", opacity: "0.4"} : {}}
								>
									<Tippy content={<AnimateTooltip />} singleton={target}><div>Animate</div></Tippy>
								</MenuItem>
							}
							<MenuItem
								icon={<FaRedo />}
								onClick={() => {reset()}}
							>
								Restart
							</MenuItem>
							{/* pop up info button: calls on pop up intro function in Modal.jsx */}
							<MenuItem
								icon={<IoMdHelp size="1.25em" />}
								onClick={() => {}}
							>
								Help
							</MenuItem>
						</Menu> 
					</SidebarContent>
					<SidebarFooter>
						<Menu iconShape="circle">
							{/* if sidebar is collapsed, then attach icon */}
							<MenuItem icon={collapse ? <FaGithub /> : ""} >
								<a 
									className="footerButton"
									href="https://github.com/vjiang10/towers-of-hanoi" 
									target="_blank"
									rel="noreferrer"
								>
									<FaGithub />
									<span style={{ padding: 5 }}>View Source</span>
								</a>  
							</MenuItem>
						</Menu>
					</SidebarFooter>
				</IconContext.Provider>
			</ProSidebar>
			{/* passing some state as props to GameLogic */}
			<div onMouseDown={() => {setAnimate(false)}}>
				<GameLogic
					procedure={procedure}
					numTowers={numTowers} 
					numDisks={numDisks} 
					source={source} 
					destination={destination}
					texture={textures[texture]}
					animate={animate}
					playRate={playRate}
				/>
			</div>
		</>
	);
}

export default Sidebar;