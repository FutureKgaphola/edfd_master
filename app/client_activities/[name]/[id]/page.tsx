"use client";
import { useParams } from "next/navigation";
import { withAuth } from "@/lib/withAuth";
import Layout from "@/app/components/Layout";
import Companies from "@/app/components/Tables/Companies";
import { Badge } from "flowbite-react";
import { HiUserCircle } from "react-icons/hi";
import Applications from "@/app/components/Tables/Applications";

const Client_activities = () => {
  const params = useParams<{ name: string; id: string }>();
  const { id, name } = params;

  return (
    <Layout>
      <div>
        <Badge
          icon={HiUserCircle}
          className="w-fit text-white hover:bg-black bg-[#92981B]"
        >
          {decodeURIComponent(name)}
        </Badge>
        <p className="mt-4">Client Companie(s)</p>
      </div>

      <Companies id={decodeURIComponent(id)} />

      <div>
        <p className="mt-4">Client Applications(s)</p>
      </div>
      <Applications id={decodeURIComponent(id)} />
    </Layout>
  );
};

export default withAuth(Client_activities);
