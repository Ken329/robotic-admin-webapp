import React, { useEffect, useState } from "react";
import { Heading, Flex } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useGetStudentListQuery } from "../../redux/slices/app/api";
import { makeSelectStudentList } from "../../redux/slices/app/selector";
import { saveStudentList } from "../../redux/slices/app";
import Layout from "../../components/Layout/MainLayout";
import DataTable from "../../components/StudentTable";
import DataModal from "../../components/StudentTable/DataModel";

const Students = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError, refetch } = useGetStudentListQuery();
  const studentData = useSelector(makeSelectStudentList());
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      dispatch(saveStudentList(data?.data?.data));
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

  return (
    <Layout>
      <Flex flexDirection={"column"} paddingLeft={"20px"}>
        <Heading as="h2" size="lg" mb="4">
          Students
        </Heading>
        <DataTable tableData={studentData} openModal={openModal} />
        <DataModal
          isOpen={isModalOpen}
          onClose={closeModal}
          rowData={modalData}
        />
      </Flex>
    </Layout>
  );
};
export default Students;
