
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import Category from "@/components/Category";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Result from "@/models/Result";

const DashboardPage = async () => {
 const user = await currentUser();

  // 🔒 Redirect to login if not authenticated
  if (!user) {
    redirect("/");
  }

  await connectDB();
  const dbUser = await User.findOne({ email: user.emailAddresses[0]?.emailAddress });

  // ✅ If category not set, show Category selection
  if (!dbUser.category) {
    return <Category userId={dbUser._id.toString()} />;
  }
  // ✅ Fetch latest result and count total tests
  const [latestResult, testCount] = await Promise.all([
    Result.findOne({ email: user.emailAddresses[0]?.emailAddress, category: dbUser.category, }).sort({ submittedAt: -1 }),
    Result.countDocuments({ email: user.emailAddresses[0]?.emailAddress, category: dbUser.category, }),
  ]);

  const correctAnswers = latestResult?.correct || 0;
  const totalQuestions = latestResult?.total || 0;
  const accuracy = latestResult?.total ? Math.round((latestResult.correct / latestResult.total) * 100) : 0;

  const focusTopics = latestResult?.focusTopics || [];

  return <DashboardClient
    name={user.firstName}
    category={dbUser.category}
    userId={dbUser._id.toString()}
    correctAnswers={correctAnswers}
    totalQuestions={totalQuestions}
    accuracy={accuracy}
    testTaken={testCount}
    focusTopics={focusTopics}
  />
}
export default DashboardPage