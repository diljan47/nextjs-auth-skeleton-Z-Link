import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardButton(){

    return(
      <Link href="/dashboard">  
        <Button >Dashboard</Button>
      </Link>
    )
}