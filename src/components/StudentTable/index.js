import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { makeSelectUserRole } from "../../redux/slices/app/selector";
import {
  Box,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  TableContainer,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { USER_ROLE } from "../../utils/constants";
import Filters from "./Filters";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const DataTable = ({
  tableData,
  openModal,
  openAchievementsModal,
  openDeleteModal,
  totalRecords,
  pageSize,
  pageIndex,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
}) => {
  const role = useSelector(makeSelectUserRole());

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 300,
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: "Email ID",
        size: 300,
        enableSorting: true,
      },
      {
        accessorKey: "centerName",
        header: "Centre",
        size: 300,
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: ({ cell }) => {
          const status = cell.getValue();
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
      },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 100,
        cell: ({ row }) => (
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
                    openModal(row.original);
                  }}
                >
                  View
                </MenuItem>
                {role === USER_ROLE.ADMIN && (
                  <>
                    <MenuItem
                      onClick={() => {
                        openAchievementsModal(row.original);
                      }}
                    >
                      Achievements
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        openDeleteModal(row.original);
                      }}
                      color="red.500"
                      fontWeight="bold"
                    >
                      Delete
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </Flex>
        ),
      },
    ],
    [role, openModal, openAchievementsModal]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: Math.ceil(totalRecords / pageSize),
    state: {
      pagination: { pageIndex, pageSize },
      sorting: [], // Initial sorting state
    },
    onPaginationChange: (updater) => {
      const newState = updater({
        pageIndex: pageIndex,
        pageSize: pageSize,
      });

      if (newState.pageIndex !== pageIndex) {
        onPageChange(newState.pageIndex);
      }

      if (newState.pageSize !== pageSize) {
        onPageSizeChange(newState.pageSize);
      }
    },
    onSortingChange: (updater) => {
      const newSorting = updater(table.getState().sorting);

      table.setSorting(newSorting);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <Box>
      <Filters handleFilterChange={onFilterChange} />

      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Select
          width="120px"
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          borderColor="gray"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </Select>
      </Flex>

      <TableContainer>
        <Text mb={2}>Total records: {totalRecords}</Text>
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    w={header.getSize()}
                    key={header.id}
                    backgroundColor="#CBD5E0"
                    onClick={() => header.column.getToggleSortingHandler()}
                    cursor="pointer"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <Text ml={2}>
                      {header.column.getIsSorted() === "asc" && (
                        <TriangleUpIcon boxSize={4} />
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <TriangleDownIcon boxSize={4} />
                      )}
                    </Text>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} backgroundColor="#F7FAFC">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length}>
                  <Text textAlign="center">No data found</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Button
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        {table.getPageCount() > 0 ? (
          <Text>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </Text>
        ) : (
          <Text>No Page</Text>
        )}
        <Button
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

DataTable.propTypes = {
  tableData: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
  openAchievementsModal: PropTypes.func.isRequired,
  openDeleteModal: PropTypes.func.isRequired,
  totalRecords: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default DataTable;
