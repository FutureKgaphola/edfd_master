"use client";

import Layout from "../components/Layout";
import {
    Button,
    Label,
    Spinner,
    TextInput,
} from "flowbite-react";
import { withAuth } from "@/lib/withAuth"; // <-- import HOC
import { useDistricts } from "../hooks/useDistricts";
import { useState } from "react";
import { ImBin2 } from "react-icons/im";
import DistrictHistoryTable from "../components/DistrictsHistory";
import { CreateDistrict } from "../components/Modals/CreateDistrict";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MdCancel } from "react-icons/md";

function Districts() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const { data } = useDistricts();
    const [dist, setDist] = useState({
        name: "",
        id: "",
        status: "",
    });

    const [showDeleted, setshowDeleted] = useState(false);

    const [openModal, setOpenModal] = useState(false);

    const handleDelete = async (id: string) => {
        setMessage("");
        if (!id) return;

        try {
            setLoading(true);
            const resp = await axios.put("/api/District/delete", { id: id });
            if (resp.status == 201 || resp.status == 200) {
                setMessage("District Deleted successfully");
                setLoading(false);
                setDist({
                    name: "",
                    id: "",
                    status: "",
                });
                setMessage("");
                queryClient.invalidateQueries({ queryKey: ["Districts"] });

                setTimeout(() => {
                    setMessage("");
                }, 2000);
            }
        } catch (error: any) {
            setLoading(false);
            console.error("Error deleting district:", error);
            setMessage(
                "Error deeleting district: " +
                (error?.response?.data?.message || error.message || "Unknown error")
            );
        }
    };

    const handleUpdate = async (id: string, districtName: string) => {
        setMessage("");
        if (!id) return;

        try {
            setLoading(true);
            const resp = await axios.put("/api/District/update", { id: id, districtName: districtName });
            if (resp.status == 201 || resp.status == 200) {
                setMessage("District Updated successfully");
                setLoading(false);
                setDist({
                    name: "",
                    id: "",
                    status: "",
                });
                setMessage("");
                queryClient.invalidateQueries({ queryKey: ["Districts"] });

                setTimeout(() => {
                    setMessage("");
                }, 2000);
            }
        } catch (error: any) {
            setLoading(false);
            console.error("Error updating district:", error);
            setMessage(
                "Error updating district: " +
                (error?.response?.data?.message || error.message || "Unknown error")
            );
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Districts</h1>
                <div className="flex gap-4 items-center">
                    <ImBin2
                        onClick={() => setshowDeleted(!showDeleted)}
                        className="rounded border shadow-sm"
                    />
                    <Button
                        onClick={() => setOpenModal(!openModal)}
                        className="bg-[#92981B] hover:bg-black"
                        size="sm"
                    >
                        Add Districts
                    </Button>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                    {data?.data.Districts.filter((item: any) => item.status !== 0)?.map(
                        (item: any) => (
                            <Button
                                onClick={() =>
                                    setDist({
                                        id: item.id,
                                        name: item.districtName,
                                        status: item.status == "1" ? "active" : "disabled",
                                    })
                                }
                                color={item.status === 1 ? "dark" : "red"}
                                outline={item.status === 1 ? true : false}
                            >
                                {item.districtName}
                            </Button>
                        )
                    )}
                </div>
                <hr className="mt-2"></hr>
                {dist?.name ? (
                    <div className="border rounded mt-2 p-2 shadow max-w-md">

                        <MdCancel width={50} height={50} onClick={() => setDist({
                            name: "",
                            id: "",
                            status: "",
                        })} />
                        <p className="text-sm">{dist?.name}</p>
                        <div className="mb-2 block">
                            <Label htmlFor="small">Status : {dist.status}</Label>
                        </div>
                        <TextInput
                            className="max-w-md"
                            id="small"
                            value={dist?.name}
                            onChange={(e) =>
                                setDist({
                                    id: dist.id,
                                    name: e?.target.value,
                                    status: dist.status,
                                })
                            }
                            type="text"
                            sizing="sm"
                        />
                        <div className="flex gap-1 mt-2 mb-2">
                            <Button onClick={() => handleUpdate(dist?.id, dist.name)} disabled={loading} className="bg-[#92981B]" size="sm">
                                update
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={() => handleDelete(dist?.id ?? "")}
                                color="red"
                                size="sm"
                            >
                                Delete
                            </Button>
                        </div>

                        {loading && (
                            <div className="flex justify-center">
                                <Spinner
                                    size="sm"
                                    aria-label="Info spinner example"
                                    className="me-3"
                                    light
                                />
                                <p>Executing request...</p>
                            </div>
                        )}

                        {message && (
                            <div className="flex justify-center">
                                <p>{message}</p>
                            </div>
                        )}
                    </div>
                ) : null}

                <div className="mt-4">
                    {showDeleted ? (
                        <DistrictHistoryTable
                            users={
                                (data?.data.Districts).filter(
                                    (item: any) => item.status == 0
                                ) ?? []
                            }
                        />
                    ) : null}
                </div>

                <CreateDistrict openModal={openModal} setOpenModal={setOpenModal} />
            </div>
        </Layout>
    );
}

export default withAuth(Districts);
