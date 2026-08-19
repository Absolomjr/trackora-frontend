import PageHeader from "../../components/common/PageHeader";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import { LoadingBlock } from "../../components/common/Spinner";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";
import reportsApi from "../../api/reportsApi";
import { AdminDashboard, ManagerDashboard, StaffDashboard } from "./dashboards";
import "../../styles/dashboard.css";

const SUBTITLES = {
  admin: "Overview of your business performance",
  manager: "Overview of your store's performance",
  staff: "Operations at a glance",
};

export default function Dashboard() {
  const { user, role } = useAuth();
  const { data, loading, error, refetch } = useFetch(() => reportsApi.overview(), []);

  const firstName = user?.full_name ? `, ${user.full_name.split(" ")[0]}` : "";

  return (
    <div className="dashboard">
      <PageHeader
        title={`Dashboard`}
        subtitle={SUBTITLES[role] || `Welcome back${firstName}`}
      />

      {error && (
        <Alert
          variant="error"
          title="Some data failed to load"
          action={
            <Button size="sm" variant="subtle" onClick={refetch}>
              Retry
            </Button>
          }
        >
          We couldn't refresh your dashboard. Check your connection and try again.
        </Alert>
      )}

      {loading || !data ? (
        <LoadingBlock label="Loading dashboard…" />
      ) : role === "admin" ? (
        <AdminDashboard data={data} />
      ) : role === "manager" ? (
        <ManagerDashboard data={data} />
      ) : (
        <StaffDashboard data={data} />
      )}
    </div>
  );
}
