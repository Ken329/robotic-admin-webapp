import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Input,
  Text,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { FiSliders, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useParticipantsTable from "./hook/useParticipantsTable";

const ParticipantsModal = ({ blogId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { table, nameFilter, setNameFilter, totalRecords } =
    useParticipantsTable(blogId, isOpen);

  return (
    <>
      <Button size="sm" colorScheme="teal" onClick={onOpen}>
        View
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth="1200px" width="100%">
          <ModalHeader>Participants</ModalHeader>
          <ModalBody>
            <Flex mb={4} align="center" gap={4}>
              <Input
                placeholder="Search Name"
                value={nameFilter || ""}
                onChange={(e) => setNameFilter(e.target.value)}
                width="auto"
              />
            </Flex>

            <Text mb={2}>Total records: {totalRecords}</Text>

            <TableContainer>
              <Table variant="simple">
                <Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const isSorted = table
                          .getState()
                          .sorting.find((sort) => sort.id === header.id);
                        return (
                          <Th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            cursor="pointer"
                            backgroundColor="#CBD5E0"
                          >
                            <Flex align="center" gap="2">
                              <Box as="span">
                                {header.column.columnDef.header}
                              </Box>
                              {header.column.getCanSort() && (
                                <Box as="span">
                                  {isSorted ? (
                                    isSorted.desc ? (
                                      <ArrowDownIcon boxSize={4} />
                                    ) : (
                                      <ArrowUpIcon boxSize={4} />
                                    )
                                  ) : (
                                    <FiSliders />
                                  )}
                                </Box>
                              )}
                            </Flex>
                          </Th>
                        );
                      })}
                    </Tr>
                  ))}
                </Thead>
                <Tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <Tr>
                      <Td
                        colSpan={table.getAllColumns().length}
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
                          <Td key={cell.id} backgroundColor="#F7FAFC">
                            {cell.renderValue()}
                          </Td>
                        ))}
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>

              <Flex align="center" justify="start" mt={4} gap={4}>
                <Text mr={2} fontSize="sm">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </Text>
                <Button
                  size="xs"
                  onClick={() => table.previousPage()}
                  isDisabled={!table.getCanPreviousPage()}
                >
                  <FiChevronLeft />
                </Button>
                <Button
                  size="xs"
                  onClick={() => table.nextPage()}
                  isDisabled={!table.getCanNextPage()}
                >
                  <FiChevronRight />
                </Button>
              </Flex>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ParticipantsModal.propTypes = {
  blogId: PropTypes.string.isRequired,
};

export default ParticipantsModal;
