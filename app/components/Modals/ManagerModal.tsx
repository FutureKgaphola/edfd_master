
"use client";

import { getDistrict } from "@/app/services/Find_district_by_id";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "flowbite-react";
import { Dispatch, SetStateAction } from "react";
interface CreateManagerProps {
  open_manager_Modal: boolean;
  setOpen_manager_Modal: Dispatch<SetStateAction<boolean>>;
  ManagerObject:{};
  setManagerObject:Dispatch<SetStateAction<object>>;

}
export function ManagerModal({ open_manager_Modal, setOpen_manager_Modal,ManagerObject,setManagerObject }: CreateManagerProps) {
  
  const {first_name,user_email,last_name,phone,active,create_date,empno,districtId}=ManagerObject;
    return (
    <>
      <Modal show={open_manager_Modal} onClose={() => {
        setManagerObject({});
        setOpen_manager_Modal(false);
      }}>
        <ModalHeader>Loan Manager</ModalHeader>
        <ModalBody>
          <div className="space-y-6">

            {
                !ManagerObject ? ( <Spinner aria-label="Default status example" />) : (<div>
                    <p>Names: {(first_name+ " "+last_name) ?? ""}</p>
                    <p>Email: {user_email ?? ""}</p>
                    <p>Phone: {phone ?? ""}</p>
                    <p>Status: {active=='1' ? "Active": "InActive"}</p>
                    <p>Employee Number: {empno ?? ""}</p>
                    <p>District: {getDistrict(districtId) ?? ""}</p>
                </div>)
            }
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
