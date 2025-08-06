import React, { useState, useMemo, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { makeSelectUserRole } from "../../../redux/slices/app/selector";
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Button } from "@chakra-ui/react";
import { USER_ROLE } from "../../../utils/constants";
import {
  useGetALLParticipantsQuery,
  useDeleteParticipantSignUpMutation,
} from "../../../redux/slices/posts/api";
import useCustomToast from "../../CustomToast";

const useParticipantsTable = (blogId, isOpen) => {
  const toast = useCustomToast();
  const role = useSelector(makeSelectUserRole());
  const [data, setData] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const isAdmin = role === USER_ROLE.ADMIN;

  const {
    data: participantsData,
    refetch,
    isFetching,
  } = useGetALLParticipantsQuery(blogId, {
    skip: !isOpen,
  });

  const [deleteParticipant, { isLoading: isDeleting }] =
    useDeleteParticipantSignUpMutation();

  useEffect(() => {
    if (participantsData) {
      setData(participantsData.data);
    }
  }, [participantsData]);

  const totalRecords = participantsData?.data.length || 0;

  const formatDate = (dateString) =>
    formatDistanceToNow(new Date(dateString), { addSuffix: true });

  const attributeCategories = useMemo(() => {
    const categories = new Set();
    (participantsData?.data || []).forEach((row) => {
      row.attributes.forEach((attr) => categories.add(attr.category));
    });
    return [...categories];
  }, [participantsData]);

  const handleDelete = async (id) => {
    try {
      const response = await deleteParticipant(id).unwrap();
      if (response.success) {
        toast({
          title: "Participants",
          description: response?.message,
          status: "success",
        });
        refetch();
      }
    } catch (err) {
      toast({
        title: "Participants",
        description: "Failed to delete participant",
        status: "error",
      });
      console.error("Failed to delete participant:", err);
    }
  };

  const baseColumns = [
    { accessorKey: "fullName", header: "Name" },
    { accessorKey: "centerName", header: "Center" },
    { accessorKey: "nric", header: "NRIC" },
    { accessorKey: "passport", header: "Passport" },
    { accessorKey: "levelName", header: "Level" },
    { accessorFn: (row) => formatDate(row.createdAt), header: "Signed Up" },
  ];

  const actionColumn = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        size="sm"
        colorScheme="red"
        isLoading={isDeleting}
        onClick={() => handleDelete(row.original.participantId)}
      >
        Delete
      </Button>
    ),
  };

  const dynamicColumns = attributeCategories.map((category) => ({
    accessorFn: (row) => {
      const attr = row.attributes.find((attr) => attr.category === category);
      return attr ? attr.value.toString() : "N/A";
    },
    header: category,
  }));

  const columns = useMemo(() => {
    if (isAdmin) {
      return [...baseColumns, ...dynamicColumns, actionColumn];
    }
    return [...baseColumns, ...dynamicColumns];
  }, [baseColumns, dynamicColumns, actionColumn, isAdmin]);

  const filteredData = useMemo(() => {
    if (!nameFilter) return data;
    return data.filter((row) =>
      row.fullName.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }, [data, nameFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return { table, nameFilter, setNameFilter, totalRecords, isFetching };
};

export default useParticipantsTable;
