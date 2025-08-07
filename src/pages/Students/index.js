import React, { useEffect, useState } from 'react';

import { Flex, Heading } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';

import useCustomToast from '../../components/CustomToast';
import Layout from '../../components/Layout/MainLayout';
import DataTable from '../../components/StudentTable';
import AchievementsModal from '../../components/StudentTable/AchievementsModal';
import DataModal from '../../components/StudentTable/DataModel';
import DeleteModal from '../../components/StudentTable/DeleteModal';
import RenewMembershipModal from '../../components/StudentTable/RenewMembershipModal';
import { makeSelectUserRole } from '../../redux/slices/app/selector';
import { saveStudentsData } from '../../redux/slices/students';
import { useGetStudentListQuery } from '../../redux/slices/students/api';
import { makeSelectStudentData } from '../../redux/slices/students/selector';
import { USER_ROLE } from '../../utils/constants';

const Students = () => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const role = useSelector(makeSelectUserRole());
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [filters, setFilters] = useState({});

  const { data, isLoading, isError, refetch } = useGetStudentListQuery({
    limit: pageSize,
    page: pageIndex + 1,
    ...filters
  });

  const studentData = useSelector(makeSelectStudentData());
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      dispatch(saveStudentsData(data?.data?.data));
    } else if (isError) {
      toast({
        title: 'Student',
        description: 'Error getting student list',
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

  const openAchievementsModal = rowData => {
    setModalData(rowData);
    setIsAchievementsModalOpen(true);
  };

  const closeAchievementsModal = () => {
    setIsAchievementsModalOpen(false);
    refetch();
  };

  const openDeleteModal = rowData => {
    setModalData(rowData);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    refetch();
  };

  const openRenewMembershipModal = rowData => {
    setModalData(rowData);
    setIsRenewModalOpen(true);
  };

  const closeRenewMembershipModal = () => {
    setIsRenewModalOpen(false);
    refetch();
  };

  const handlePageChange = newPageIndex => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = newPageSize => {
    setPageSize(newPageSize);
  };

  const handleFilterChange = newFilters => {
    setFilters(newFilters);
  };

  return (
    <Layout isLoading={isLoading}>
      <Flex flexDirection={'column'} paddingLeft={'20px'}>
        <Heading as="h2" size="lg" mb="4">
          Students
        </Heading>
        <DataTable
          tableData={studentData}
          openModal={openModal}
          openAchievementsModal={openAchievementsModal}
          openRenewMembershipModal={openRenewMembershipModal}
          openDeleteModal={openDeleteModal}
          totalRecords={data?.data?.totalUser || 0}
          pageSize={pageSize}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterChange={handleFilterChange}
        />
        <DataModal isOpen={isModalOpen} onClose={closeModal} rowData={modalData} />
        {role === USER_ROLE.ADMIN && (
          <>
            <AchievementsModal
              isOpen={isAchievementsModalOpen}
              onClose={closeAchievementsModal}
              rowData={modalData}
            />
            <RenewMembershipModal
              isOpen={isRenewModalOpen}
              onClose={closeRenewMembershipModal}
              rowData={modalData}
            />
            <DeleteModal
              isOpen={isDeleteModalOpen}
              onClose={closeDeleteModal}
              rowData={modalData}
            />
          </>
        )}
      </Flex>
    </Layout>
  );
};

export default Students;
