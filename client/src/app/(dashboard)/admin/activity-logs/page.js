import { Suspense } from "react";
import ActivityLogContent from "./activity-logs";

const ActivityLogPage = () => {
  return (
    <Suspense>
      <ActivityLogContent />
    </Suspense>
  );
};

export default ActivityLogPage;
