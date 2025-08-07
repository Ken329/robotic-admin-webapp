import React, { useEffect, useMemo, useState } from 'react';

import { Flex, Heading } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';

import DataTable from '../../components/CentreTable';
import DataModal from '../../components/CentreTable/DataModal';
import useCustomToast from '../../components/CustomToast';
import Layout from '../../components/Layout/MainLayout';
import { saveCentresData } from '../../redux/slices/centre';
import { useGetCentresListQuery } from '../../redux/slices/centre/api';
import { makeSelectCentresData } from '../../redux/slices/centre/selector';

const Centres = () => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetCentresListQuery();
  const centreData = useSelector(makeSelectCentresData());

  const tableData = useMemo(() => centreData, [centreData]);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      dispatch(saveCentresData(data?.data));
    } else if (isError) {
      toast({
        title: 'Centre',
        description: 'Error getting centre list',
        status: 'error'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, isError, dispatch]);

  const openModal = rowData => {
    setModalData(rowData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <Layout isLoading={isLoading}>
      <Flex flexDirection={'column'} paddingLeft={'20px'}>
        <Heading as="h2" size="lg" mb="4">
          Centres
        </Heading>
        {/* centre table */}
        <DataTable tableData={tableData} openModal={openModal} refetch={refetch} />
        {/* view centre */}
        <DataModal isOpen={isModalOpen} onClose={closeModal} rowData={modalData} />
      </Flex>
    </Layout>
  );
};

export default Centres;
