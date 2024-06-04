import React, { useEffect, useState } from "react";
import { Heading, Flex } from "@chakra-ui/react";
import { toast } from "react-toastify";
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

const Students = () => {
  const dispatch = useDispatch();
  const role = useSelector(makeSelectUserRole());
  const { data, isLoading, isError, refetch } = useGetStudentListQuery();
  const studentData = useSelector(makeSelectStudentData());
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      dispatch(saveStudentsData(data?.data?.data));
    } else if (isError) {
      toast.error("Error getting student list");
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
