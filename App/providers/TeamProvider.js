import React, { useState, createContext } from 'react';

export const TeamContext = createContext({});

export const TeamProvider = (props) => {
    const [team, setTeam] = useState(props.currentTeam);
 
  return (
    <TeamContext.Provider value={{ team, setTeam }}>
      {props.children}
    </TeamContext.Provider>
  );
};

