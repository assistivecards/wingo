import { useContext } from 'react';
import { AppContext } from '../context/app';

const useAppContext = () => {
  return useContext(AppContext);
};
export default useAppContext;
