import React from 'react';
import NavContext, { NavContextType } from './context';

const useNavigation = (): NavContextType => React.useContext(NavContext);

export default useNavigation;
