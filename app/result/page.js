import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ResultClient from "@/components/ResultClient";

const ResultPage = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/");
    }

    return <ResultClient />;
}
export default ResultPage
