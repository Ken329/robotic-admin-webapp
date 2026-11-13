import { useCallback } from 'react';

import { useToast } from '@chakra-ui/react';

const useCustomToast = () => {
  const toast = useToast();

  return useCallback(
    ({ title, description, status }) => {
      toast({
        title: title || 'Notification',
        description: description || '',
        status: status || 'info',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    },
    [toast]
  );
};

export default useCustomToast;
