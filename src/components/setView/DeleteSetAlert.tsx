import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { NextRouter } from "next/router";
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setId: string | string[] | undefined;
  router: NextRouter;
}

export default function DeleteSetAlert({
  isOpen,
  onClose,
  setId,
  router,
}: Props) {
  const cancelRef = React.useRef();

  const deleteSet = async () => {
    const response = await fetch(`/api/set?setId=${setId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.push("/");
    } else {
      router.push("/error");
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader mt={5} py={2} fontSize="lg" fontWeight="bold">
            Delete flashcard set
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete this set? You can't undo this action
            afterwards.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={deleteSet} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
