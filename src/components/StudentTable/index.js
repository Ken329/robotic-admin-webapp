import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Flex,
  Box,
  Badge,
  Button,
  ButtonGroup,
  Icon,
  Text,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import Filters from "./Filters";
import { FiSliders } from "react-icons/fi";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    size: 300,
    cell: (props) => <p>{props.getValue()}</p>,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "email",
    header: "Email ID",
    size: 300,
    cell: (props) => <p>{props.getValue()}</p>,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "centerName",
    header: "Centre",
    size: 300,
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 200,
    cell: (props) => {
      const status = props.getValue();
      let color;
      switch (status) {
        case "approved":
          color = "green.600";
          break;
        case "rejected":
          color = "red.600";
          break;
        case "pending center":
          color = "blue.600";
          break;
        case "pending admin":
          color = "yellow.500";
          break;
        default:
          color = "black";
      }
      return (
        <Flex justifyContent="center">
          <Badge
            size={"xl"}
            px={2}
            py={2}
            borderRadius={"10px"}
            color="white"
            backgroundColor={color}
          >
            {status}
          </Badge>
        </Flex>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, columnId, filterStatuses) => {
      if (filterStatuses.length === 0) return true;
      const status = row.getValue(columnId);
      return filterStatuses.includes(status);
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    size: 100,
    cell: ({ openModal, ...props }) => (
      <Flex justifyContent="center">
        <Button
          colorScheme="teal"
          size={"sm"}
          onClick={() => {
            openModal(props.row.original);
          }}
        >
          View
        </Button>
      </Flex>
    ),
  },
];

const DataTable = ({ tableData, openModal }) => {
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  return (
    <Box>
      <Filters
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <TableContainer>
        <Text mb={2}>Total records: {table.getRowModel().rows.length}</Text>
        <Table size="md" w={table.getTotalSize()}>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    w={header.getSize()}
                    key={header.id}
                    backgroundColor="#CBD5E0"
                  >
                    <Flex align={"center"} gap={"10px"}>
                      <Box as="span">{header.column.columnDef.header}</Box>
                      {header.column.getCanSort() && (
                        <Icon
                          as={FiSliders}
                          onClick={header.column.getToggleSortingHandler()}
                        />
                      )}
                      <Box as="span">
                        {
                          {
                            asc: <ArrowUpIcon boxSize={3} ml={2} />,
                            desc: <ArrowDownIcon boxSize={3} ml={2} />,
                          }[header.column.getIsSorted()]
                        }
                      </Box>
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.length === 0 ? (
              <Tr>
                <Td
                  colSpan={columns.length}
                  textAlign="center"
                  backgroundColor="#F7FAFC"
                >
                  No data found
                </Td>
              </Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      w={cell.column.getSize()}
                      key={cell.id}
                      backgroundColor="#F7FAFC"
                    >
                      {flexRender(cell.column.columnDef.cell, {
                        ...cell.getContext(),
                        openModal,
                      })}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
        <br />
        <Text mb={2}>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </Text>
        <ButtonGroup size="sm" isAttached variant="solid">
          <Button
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
        </ButtonGroup>
      </TableContainer>
    </Box>
  );
};

DataTable.propTypes = {
  tableData: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default DataTable;
