import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Icon,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";

const STATUSES = [
  { id: 1, name: "pending center", color: "blue.300" },
  { id: 2, name: "pending admin", color: "yellow.400" },
  { id: 3, name: "approved", color: "green.400" },
  { id: 4, name: "rejected", color: "red.400" },
];

const ColorIcon = ({ color, ...props }) => (
  <Box w="12px" h="12px" bg={color} borderRadius="3px" {...props} />
);

const StatusItem = ({ status, setColumnFilters, activeStatus }) => {
  const isActive = activeStatus === status.name;

  const handleClick = () => {
    if (isActive) {
      setColumnFilters([]);
    } else {
      setColumnFilters([{ id: "status", value: status.name }]);
    }
  };
  return (
    <Flex
      align="center"
      cursor="pointer"
      borderRadius={5}
      fontWeight="bold"
      p={1.5}
      color={activeStatus === status.name ? "white" : "gray.800"}
      bg={activeStatus === status.name ? "gray.800" : "transparent"}
      _hover={{
        bg: "gray.400",
      }}
      onClick={handleClick}
    >
      <ColorIcon color={status.color} mr={3} />
      {status.name}
    </Flex>
  );
};
const FilterPopover = ({ columnFilters, setColumnFilters }) => {
  const activeStatus =
    columnFilters.find((f) => f.id === "status")?.value || "";

  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Button size={"sm"} leftIcon={<Icon as={FiFilter} fontSize={18} />}>
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text fontSize="md" fontWeight="bold" mb={4}>
            Filter By:
          </Text>
          <Text fontWeight="bold" color="gray.400" mb={1}>
            Status
          </Text>
          <VStack align="flex-start" spacing={1}>
            {STATUSES.map((status) => (
              <StatusItem
                status={status}
                key={status.name}
                activeStatus={activeStatus}
                setColumnFilters={setColumnFilters}
              />
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

StatusItem.propTypes = {
  status: PropTypes.object.isRequired,
  setColumnFilters: PropTypes.func.isRequired,
  activeStatus: PropTypes.string,
};

ColorIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

FilterPopover.propTypes = {
  columnFilters: PropTypes.any.isRequired,
  setColumnFilters: PropTypes.func.isRequired,
};

export default FilterPopover;
