import React, { useState } from 'react';
import './ToggleSwitch.css'; 
import { CampusStatus } from '../App';


function ToggleSwitch({status}:{status:string}) {
  const [isOn, setIsOn] = useState(status==CampusStatus.ACTIVE);

  const handleToggle = () => {
    setIsOn(!isOn);
    if(status==CampusStatus.ACTIVE){
      status=CampusStatus.ARCHIVED;
    }else{
      status=CampusStatus.ACTIVE;
    }
  };

  return (
    <div className="toggle-container">
      <label className="switch">
        <input type="checkbox" checked={isOn} onChange={handleToggle} />
        <span className="slider"></span>
      </label>
    </div>
  );
}

export default ToggleSwitch;
