import { useState, useMemo, useEffect } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { useGetALLParticipantsQuery } from "../../../redux/slices/posts/api";

const useParticipantsTable = (blogId, isOpen) => {
  const [data, setData] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data: participantsData } = useGetALLParticipantsQuery(blogId, {
    skip: !isOpen,
  });

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

  const predefinedColumns = [
    { accessorKey: "fullName", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "centerName", header: "Center" },
    { accessorKey: "levelName", header: "Level" },
    { accessorFn: (row) => formatDate(row.createdAt), header: "Signed Up" },
  ];

  const dynamicColumns = attributeCategories.map((category) => ({
    accessorFn: (row) => {
      const attr = row.attributes.find((attr) => attr.category === category);
      return attr ? attr.value.toString() : "N/A";
    },
    header: category,
  }));

  const columns = useMemo(
    () => [...predefinedColumns, ...dynamicColumns],
    [dynamicColumns]
  );

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

  return { table, nameFilter, setNameFilter, totalRecords };
};

export default useParticipantsTable;
