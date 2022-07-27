import React from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

// Contains components with tooltip descriptions to be used in Sidebar.jsx

// returns procedure rules and objectives
export const ProcedureTooltip = ({ procedure }) => 
  procedure === 0 ? 
  <p>
    <b>Rules:</b> <br />
    <b>1.</b> Larger disks cannot be placed on top of smaller disks <br />
    <b>2.</b> Only one disk can be moved at the time, the topmost disk at a tower <br />
    <br />
    <b>Objectives:</b> <br />
    <b>1.</b> Move all disks from the source (<FaChevronUp />) tower to the destination (<FaChevronDown />) tower
  </p> :
  procedure === 1 ? 
  <p>
    <b>Rules:</b> <br />
    <b>1.</b> Larger disks cannot be placed on top of smaller disks (Same size disks can) <br />
    <b>2.</b> Only one disk can be moved at the time, the topmost disk at a tower <br />
    <br />
    <b>Objectives:</b> <br />
    <b>1.</b> Separate the total number of disks evenly, half on the source (<FaChevronUp />) tower and half on the destination (<FaChevronDown />) tower <br />
    <b>2.</b> Make both towers monochrome: <span style={{ color: "Cyan" }}>cyan</span> for <FaChevronUp /> tower and <span style={{ color: "LightBlue" }}>light blue</span> for <FaChevronDown /> tower
  </p> :
  procedure === 2 ? 
  <p>
    <b>Rules:</b> <br />
    <b>1.</b> Larger disks cannot be placed on top of smaller disks <br />
    <b>2.</b> Only one disk can be moved at the time, the topmost disk at a tower <br />
    <b>3.</b> In a single move, a disk can only be moved to an adjacent tower <br />
    <br />
    <b>Objectives:</b> <br />
    <b>1.</b> Move all disks from the source (<FaChevronUp />) tower to the destination (<FaChevronDown />) tower
  </p> :
  <p></p>

export const RulesTooltip = () =>
  <p>Set puzzle rules and type</p> 

export const TowerTooltip = () =>
  <p>Set the number of towers</p>

export const DiskTooltip = () =>
  <p>Set the number of disks</p>

export const SourceTooltip = () =>
  <p>Set the source tower, where initial disks are generated</p>

export const DestTooltip = () => 
  <p>Set the destination tower, to where disks have to be moved</p>

export const ThemeTooltip = () =>
  <p>Set the background image</p>

export const MaterialTooltip = () =>
  <p>Set the material with which disk and tower components are generated</p>

export const AnimateTooltip = () => 
  <p>
    Toggle solution animation by clicking on the icon or using the spacebar <br/ > 
    Animation works for any puzzle configuration <br /> 
    <b>Note:</b> solution animations are only available for 3 towers
  </p>