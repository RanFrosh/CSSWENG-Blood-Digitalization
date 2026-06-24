import { getProfile } from "../back/fetch_profile/single_profile";
import Home from "./client";

export default async function Page() {
    const res = await getProfile();  
    
    return <Home initialProfile={res.data} />;
}   