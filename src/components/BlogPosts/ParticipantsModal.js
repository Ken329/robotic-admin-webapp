import React, { useState } from 'react';

import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure
} from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight, FiSliders } from 'react-icons/fi';

import useParticipantsTable from '@components/BlogPosts/hook/useParticipantsTable';

const ParticipantsModal = ({ blogId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { table, nameFilter, setNameFilter, totalRecords, deleteParticipant, isDeleting } =
    useParticipantsTable(blogId, isOpen);

  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  const handleDeleteClick = participantId => {
    setSelectedParticipantId(participantId);
    onConfirmOpen();
  };

  const confirmDelete = async () => {
    if (selectedParticipantId) {
      await deleteParticipant(selectedParticipantId);
      setSelectedParticipantId(null);
      onConfirmClose();
    }
  };

  return (
    <>
      <Button size="sm" colorScheme="teal" onClick={onOpen}>
        View
      </Button>

      {/* Participants Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Participants</ModalHeader>
          <ModalBody>
            <Flex mb={4} align="center" gap={4}>
              <Input
                placeholder="Search Name"
                value={nameFilter || ''}
                onChange={e => setNameFilter(e.target.value)}
                width="auto"
              />
            </Flex>

            <Text mb={2}>Total records: {totalRecords}</Text>

            <TableContainer>
              <Table variant="simple">
                <Thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => {
                        const isSorted = table
                          .getState()
                          .sorting.find(sort => sort.id === header.id);

                        return (
                          <Th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            cursor="pointer"
                            backgroundColor="#CBD5E0"
                          >
                            <Flex align="center" gap="2">
                              <Box as="span">{header.column.columnDef.header}</Box>
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
                    table.getRowModel().rows.map(row => (
                      <Tr key={row.id}>
                        {row.getVisibleCells().map(cell => {
                          const isActionCell = cell.column.id === 'actions';

                          return (
                            <Td key={cell.id} backgroundColor="#F7FAFC">
                              {isActionCell ? (
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  isLoading={isDeleting}
                                  onClick={() => handleDeleteClick(row.original.participantId)}
                                >
                                  Delete
                                </Button>
                              ) : (
                                flexRender(cell.column.columnDef.cell, cell.getContext())
                              )}
                            </Td>
                          );
                        })}
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>

              <Flex align="center" justify="start" mt={4} gap={4}>
                <Text mr={2} fontSize="sm">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Participant</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this participant? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onConfirmClose}>
              Cancel
            </Button>
            <Button colorScheme="red" ml={3} onClick={confirmDelete} isLoading={isDeleting}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ParticipantsModal.propTypes = {
  blogId: PropTypes.string.isRequired
};

export default ParticipantsModal;
