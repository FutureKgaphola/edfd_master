"use client";
import { withAuth } from "@/lib/withAuth";
import ApplicationTracking from "../components/applicationChanges";
import Layout from "../components/Layout";

const Audut = () => {
    return (
        <Layout>
            <ApplicationTracking />
        </Layout>

    );
}

export default withAuth(Audut);