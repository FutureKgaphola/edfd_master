"use client";
import AuditTable from "@/app/components/AuditTable";
import Layout from "@/app/components/Layout";
import { withAuth } from "@/lib/withAuth";

const AuditPage=({ params }: { params: { applicationId: string } })=> {
  return (
    <Layout>
        <div className="max-w-6xl mx-auto p-6">
      <AuditTable applicationId={parseInt(params.applicationId, 10)} />
    </div>
    </Layout>
  );
}

export default withAuth(AuditPage);
