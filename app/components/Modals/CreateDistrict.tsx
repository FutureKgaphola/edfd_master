"use client";

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, TextInput } from "flowbite-react";
import { Dispatch, SetStateAction, useState } from "react";

interface CreateDistrictProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export function CreateDistrict({ openModal, setOpenModal }: CreateDistrictProps) {
  const [districtName, setDistrictName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleCreateDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const trimmedName = districtName.trim();
    if (!trimmedName) return;

    try {
      setLoading(true);
      const resp = await axios.post("/api/District/create", { districtName: trimmedName });

      if (resp.status == 201 || resp.status == 200) {
        setDistrictName("");
        setMessage("District created successfully");
        setLoading(false);
        queryClient.invalidateQueries({ queryKey: ["Districts"] });

        setTimeout(() => {
          setOpenModal(false);
          setMessage("");
          
        }, 2000);
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Error creating district:", error);
      setMessage(
        "Error creating district: " +
          (error?.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <ModalHeader>New District</ModalHeader>
      <ModalBody>
        <form onSubmit={handleCreateDistrict} className="flex max-w-full flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="district">District Name</Label>
            </div>
            <TextInput
              id="district"
              type="text"
              placeholder="District Name"
              required
              shadow
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
            />
          </div>

          <Button className="bg-[#92981B]" disabled={loading} type="submit" color="appsuccess">
            {loading && <Spinner size="sm" aria-label="Loading spinner" className="me-3" light />}
            Create new district
          </Button>

          {message && <p>{message}</p>}
        </form>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}
