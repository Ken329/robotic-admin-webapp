import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = ({ title, description, status }) => {
    toast({
      title: title || "Notification",
      description: description || "",
      status: status || "info",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  return showToast;
};

export default useCustomToast;
