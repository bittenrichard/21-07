import { useState } from 'react';
import { PageKey } from '../types';

export const useNavigation = (initialPage: PageKey = 'login') => {
  const [currentPage, setCurrentPage] = useState<PageKey>(initialPage);

  const navigateTo = (page: PageKey) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    navigateTo
  };
};