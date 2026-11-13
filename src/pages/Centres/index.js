import React, { useCallback, useEffect, useState } from 'react';

import { Flex, Heading } from '@chakra-ui/react';

import { useGetCentresListQuery } from '@redux/slices/centre/api';
import { EMPTY_ARRAY } from '@utils/constants';
import DataTable from '@components/CentreTable';
import DataModal from '@components/CentreTable/DataModal';
import useCustomToast from '@components/CustomToast';
import PageLayout from '@components/Layout/PageLayout';

const Centres = () => {
  const toast = useCustomToast();
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetCentresListQuery();
  const tableData = data?.data ?? EMPTY_ARRAY;

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Centre',
        description: 'Error getting centre list',
        status: 'error'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  const openModal = useCallback(rowData => {
    setModalData(rowData);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    refetch();
  }, [refetch]);

  return (
    <PageLayout isLoading={isLoading}>
      <Flex flexDirection={'column'} paddingLeft={'20px'}>
        <Heading as="h2" size="lg" mb="4">
          Centres
        </Heading>
        {/* centre table */}
        <DataTable tableData={tableData} openModal={openModal} refetch={refetch} />
        {/* view centre */}
        <DataModal isOpen={isModalOpen} onClose={closeModal} rowData={modalData} />
      </Flex>
    </PageLayout>
  );
};

export default Centres;
