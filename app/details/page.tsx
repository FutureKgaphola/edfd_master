"use client";
import { useParams } from "next/navigation";
import { withAuth } from "@/lib/withAuth";
import Layout from "@/app/components/Layout";
import Companies from "@/app/components/Tables/Companies";
import { Badge, Button } from "flowbite-react";
import { HiDownload, HiUserCircle } from "react-icons/hi";
import Applications from "@/app/components/Tables/Applications";
import useFetchCompanyAddress from "@/app/hooks/useFetchCompanyAddress";
import useFetchCompanyBanking from "@/app/hooks/useFetchCompanyBanking";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { getDistrict } from "../services/Find_district_by_id";
import { handleDownload } from "../services/FileDownloader";

const CompanyDetails = () => {

  const Authprop = useSelector((state: RootState) => state.AuthReducer);
  const selected = useSelector((state: RootState) => state.SelectedCompanyReducer);
  const userid = Authprop.user?.user_email;
  const regNo = selected.regNo;

  const { data, isLoading, error } = useFetchCompanyAddress();
  const { data: d_banking, isLoading: d_isLoading, error: d_error } = useFetchCompanyBanking();

  const {
    bankName,
    accountNumber,
    branchCode,
    branchName,
    accountType,
    accountHolder,
    holderEmail,
    filename,
    id
  } = d_banking || {}

  const { id:idAddress,physicalAddress,holderEmail:addr_holderEmail,lease_filename, proof_filename,postal, districtId, leased } =
    data || {};
  const [CurrentDistrict, setCurrentDistrict] = useState("");

  useEffect(() => {
    if (data) {
      getDistrict(districtId || "")
        .then((district) => {
          setCurrentDistrict(district || "");
        })
        .catch(() => {
          setCurrentDistrict("");
        });
    }
  }, [data]);

  return (
    <Layout>
      <div>
        <Badge
          icon={HiUserCircle}
          className="w-fit text-white hover:bg-black bg-[#92981B]"
        >
          {decodeURIComponent(regNo)}
        </Badge>
      </div>


      <div className="flex flex-row flex-wrap gap-3 mt-5">
        <div className="relative mt-2 sm:mt-4 md:mt-4 gap-4 w-fit border shadow rounded p-4 pt-3">
          <p className="text-nowrap absolute left-2 -top-3 bg-[#92981B] text-white rounded p-1">
            Company Address
          </p>
          <p className="mt-4">Physical Address: {physicalAddress || "Not provided"}</p>
          <p className="">Postal Address: {postal || "Not provided"}</p>
          <p className="">District: {CurrentDistrict || "Not provided"}</p>
          <Button disabled={!physicalAddress ? true :false}
            onClick={()=>handleDownload(idAddress,addr_holderEmail,proof_filename,"companyproofAddress")}
            className="bg-[#25251c] hover:bg-[#92981B] text-white"
            size="xs"
          >
            Proof of Address
            <HiDownload className="ml-2 h-5 w-5" />
          </Button>
          {leased !== "Own" ? (
            <Button disabled={!lease_filename ? true :false}
              onClick={() => handleDownload(idAddress,addr_holderEmail,lease_filename,"leaseAgrement")  }
              className="bg-[#25251c] mt-2 hover:bg-[#92981B] text-white"
              size="xs"
            >
              lease Agrement
              <HiDownload className="ml-2 h-5 w-5" />
            </Button>
          ) : null}

          <p className="text-center">{isLoading && "fetching data...."}</p>
        </div>

        <div className="relative mt-2 sm:mt-4 md:mt-4 gap-4 w-fit border shadow rounded p-4 pt-3">
          <p className=" text-nowrap absolute left-2 -top-3 bg-[#92981B] text-white rounded p-1">
            Company Banking
          </p>
          <p className="mt-4">Bank Name: {(!bankName || bankName=="Default Bank Name") ? "Not provided" : bankName}</p>
          <p className="">Account N0.: {(!accountNumber || accountNumber=="0000000000") ? "Not provided" : accountNumber}</p>
          <p className="">Branch Code: {(!branchCode || branchCode=="00000") ? "Not provided" : branchCode}</p>
          <p className="">Branch Name: {(!branchName || branchName=="Branch Name") ? "Not provided" : branchName}</p>
          <p className="">Account Type: {(!accountType || accountType=="Account Type") ? "Not provided" : accountType}</p>
          <p className="">Account Holder: {(!accountHolder || accountHolder=="Account Holder") ? "Not provided" :accountHolder}</p>
            <Button
            disabled={
              !bankName ||
              bankName =="Default Bank Name" ||
              !accountNumber ||
              accountNumber == "0000000000" ||
              !branchCode ||
              branchCode == "00000" ||
              !branchName ||
              branchName == "Branch Name" ||
              !accountType ||
              accountType == "Account Type" ||
              !accountHolder ||
              accountHolder == "Account Holder"
            }
            onClick={() => handleDownload(id,holderEmail,filename,"companyproofBankng") }
            className="bg-[#25251c] mt-2 hover:bg-[#92981B] text-white"
            size="xs"
            >
            Proof of Account
            <HiDownload className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-center">{d_isLoading && "fetching data...."}</p>
        </div>
      </div>

    </Layout>
  );
};

export default withAuth(CompanyDetails);
