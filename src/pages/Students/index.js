import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';

import { Flex, Heading } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { selectUserRole } from '@redux/slices/app/selector';
import { useGetStudentListQuery } from '@redux/slices/students/api';
import { EMPTY_ARRAY, USER_ROLE } from '@utils/constants';
import useCustomToast from '@components/CustomToast';
import PageLayout from '@components/Layout/PageLayout';
import DataTable from '@components/StudentTable';

const DataModal = lazy(() => import('@components/StudentTable/DataModel'));
const AchievementsModal = lazy(() => import('@components/StudentTable/AchievementsModal'));
const RenewMembershipModal = lazy(() => import('@components/StudentTable/RenewMembershipModal'));
const DeleteModal = lazy(() => import('@components/StudentTable/DeleteModal'));

const MODAL = {
  VIEW: 'view',
  ACHIEVEMENTS: 'achievements',
  RENEW: 'renew',
  DELETE: 'delete'
};

const Students = () => {
  const toast = useCustomToast();
  const role = useSelector(selectUserRole);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [filters, setFilters] = useState({});
  const [modal, setModal] = useState({ type: null, rowData: null });

  const { data, isLoading, isError, refetch } = useGetStudentListQuery({
    limit: pageSize,
    page: pageIndex + 1,
    ...filters
  });

  const studentData = data?.data?.data ?? EMPTY_ARRAY;
  const isAdmin = role === USER_ROLE.ADMIN;

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Student',
        description: 'Error getting student list',
        status: 'error'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  const openModal = useCallback(rowData => setModal({ type: MODAL.VIEW, rowData }), []);
  const openAchievementsModal = useCallback(
    rowData => setModal({ type: MODAL.ACHIEVEMENTS, rowData }),
    []
  );
  const openRenewMembershipModal = useCallback(
    rowData => setModal({ type: MODAL.RENEW, rowData }),
    []
  );
  const openDeleteModal = useCallback(rowData => setModal({ type: MODAL.DELETE, rowData }), []);

  // Modals mount only while open, so each opening starts with fresh state.
  const closeModal = useCallback(() => {
    setModal(prev => ({ ...prev, type: null }));
    refetch();
  }, [refetch]);

  return (
    <PageLayout isLoading={isLoading}>
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
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
          onFilterChange={setFilters}
        />
        <Suspense fallback={null}>
          {modal.type === MODAL.VIEW && (
            <DataModal isOpen onClose={closeModal} rowData={modal.rowData} />
          )}
          {isAdmin && modal.type === MODAL.ACHIEVEMENTS && (
            <AchievementsModal isOpen onClose={closeModal} rowData={modal.rowData} />
          )}
          {isAdmin && modal.type === MODAL.RENEW && (
            <RenewMembershipModal isOpen onClose={closeModal} rowData={modal.rowData} />
          )}
          {isAdmin && modal.type === MODAL.DELETE && (
            <DeleteModal isOpen onClose={closeModal} rowData={modal.rowData} />
          )}
        </Suspense>
      </Flex>
    </PageLayout>
  );
};

export default Students;
