import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
  import { useDisclosure } from '@chakra-ui/react'
  import CreateEvent from './CreateEvent'

function CreateEventButton() {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const btnRef = React.useRef(null)
    return (
      <>
  
        <Button mt={3} ref={btnRef} onClick={onOpen}>
          Add Event
        </Button>
  
        <Modal
          onClose={onClose}
          finalFocusRef={btnRef}
          isOpen={isOpen}
          scrollBehavior={'inside'}
          size={'xl'}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <CreateEvent/>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  export default CreateEventButton;