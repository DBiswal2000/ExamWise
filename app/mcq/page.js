import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MCQClient from "@/components/MCQClient";

const MCQPage = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/");
    }

    return <MCQClient />;
};

export default MCQPage;
