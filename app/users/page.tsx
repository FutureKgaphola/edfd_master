"use client";

import Layout from "../components/Layout";
import UserTable from "../components/UserTable";
import ClientTable from "../components/ClientsTable";
import { Button, TabItem, Tabs } from "flowbite-react";
import { HiUserCircle, HiUserGroup } from "react-icons/hi";
import { withAuth } from "@/lib/withAuth"; // <-- import HOC

function Users() {
  const staffUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", joined: "2023-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active", joined: "2023-02-20" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Editor", status: "Inactive", joined: "2023-03-10" },
  ];

  const clientUsers = [
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Client", status: "Active", joined: "2023-04-05" },
    { id: 5, name: "Michael Brown", email: "michael@example.com", role: "Client", status: "Pending", joined: "2023-05-12" },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <Button className="bg-[#92981B]" size="sm">Add User</Button>
      </div>

      <div className="mt-6">
        <Tabs aria-label="Users Tabs" variant="underline">
          <TabItem active title="Internal Staff" icon={HiUserCircle}>
            <UserTable users={staffUsers} />
          </TabItem>
          <TabItem title="Clients" icon={HiUserGroup}>
            <ClientTable users={clientUsers} />
          </TabItem>
        </Tabs>
      </div>
    </Layout>
  );
}

export default withAuth(Users);
