
"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Dispatch, SetStateAction } from "react";


interface MessageProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  message:string;
  title: string;
}
export function Messages({ openModal, setOpenModal,message,title }: MessageProps) {

  return (
    <>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
