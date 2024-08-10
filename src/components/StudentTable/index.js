import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { makeSelectUserRole } from "../../redux/slices/app/selector";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Select,
} from "@chakra-ui/react";
import { USER_ROLE } from "../../utils/constants";
import Filters from "./Filters";
import { FiSliders } from "react-icons/fi";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { BiDotsHorizontalRounded } from "react-icons/bi";

const createColumns = (role) => [
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
    size: 100,
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
    cell: ({ openModal, openAchievementsModal, ...props }) => (
      <Flex justifyContent="center" gap="10px">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<BiDotsHorizontalRounded />}
            variant="solid"
            size="md"
          />
          <MenuList>
            <MenuItem
              onClick={() => {
                openModal(props.row.original);
              }}
            >
              View
            </MenuItem>
            {role === USER_ROLE.ADMIN && (
              <MenuItem
                onClick={() => {
                  openAchievementsModal(props.row.original);
                }}
              >
                Achievements
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>
    ),
  },
];

const DataTable = ({ tableData, openModal, openAchievementsModal }) => {
  const role = useSelector(makeSelectUserRole());
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const columns = createColumns(role);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageSize: 10,
  });
  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, pagination },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  useEffect(() => {
    setData(tableData);
    setTotalRecords(tableData.length);
  }, [tableData]);

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPagination((prev) => ({ ...prev, pageSize: newSize }));
  };

  return (
    <Box>
      <Filters
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <Text mb={2}>Total records: {totalRecords}</Text>
      <Flex mb={2} align="center" gap={2}>
        <Text>Rows per page:</Text>
        <Select
          value={pagination.pageSize}
          onChange={handlePageSizeChange}
          width="auto"
          maxWidth="150px"
          variant="outline"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </Select>
      </Flex>
      <TableContainer>
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
                        openAchievementsModal,
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
  openAchievementsModal: PropTypes.func.isRequired,
};

export default DataTable;
