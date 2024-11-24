"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardButton(){
    const router = useRouter();
    return <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
}