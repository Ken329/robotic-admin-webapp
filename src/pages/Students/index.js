import React, { useEffect, useState } from "react";
import { Heading, Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { makeSelectUserRole } from "../../redux/slices/app/selector";
import { useGetStudentListQuery } from "../../redux/slices/students/api";
import { makeSelectStudentData } from "../../redux/slices/students/selector";
import { saveStudentsData } from "../../redux/slices/students";
import Layout from "../../components/Layout/MainLayout";
import DataTable from "../../components/StudentTable";
import DataModal from "../../components/StudentTable/DataModel";
import AchievementsModal from "../../components/StudentTable/AchievementsModal";
import { USER_ROLE } from "../../utils/constants";
import useCustomToast from "../../components/CustomToast";

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
    ...filters,
  });

  const studentData = useSelector(makeSelectStudentData());
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      dispatch(saveStudentsData(data?.data?.data));
    } else if (isError) {
      toast({
        title: "Student",
        description: "Error getting student list",
        status: "error",
      });
    }
  }, [data, isLoading, isError, dispatch]);

  const openModal = (rowData) => {
    setModalData(rowData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    refetch();
  };

  const openAchievementsModal = (rowData) => {
    setModalData(rowData);
    setIsAchievementsModalOpen(true);
  };

  const closeAchievementsModal = () => {
    setIsAchievementsModalOpen(false);
    refetch();
  };

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Layout isLoading={isLoading}>
      <Flex flexDirection={"column"} paddingLeft={"20px"}>
        <Heading as="h2" size="lg" mb="4">
          Students
        </Heading>
        <DataTable
          tableData={studentData}
          openModal={openModal}
          openAchievementsModal={openAchievementsModal}
          totalRecords={data?.data?.totalUser || 0}
          pageSize={pageSize}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterChange={handleFilterChange}
        />
        <DataModal
          isOpen={isModalOpen}
          onClose={closeModal}
          rowData={modalData}
        />
        {role === USER_ROLE.ADMIN && (
          <AchievementsModal
            isOpen={isAchievementsModalOpen}
            onClose={closeAchievementsModal}
            rowData={modalData}
          />
        )}
      </Flex>
    </Layout>
  );
};
export default Students;
