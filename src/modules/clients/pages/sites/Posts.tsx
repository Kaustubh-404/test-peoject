import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Box, Button, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";

import { useGetClientSiteById } from "@modules/clients/apis/hooks/useGetClientSitesById";
import { guardSelectionsColumns } from "@modules/clients/columns/ClientPostsColumns";
import { GuardAssignmentModal } from "@modules/clients/components/modals/SiteUpdateModals";
import { Edit } from "lucide-react";
import { useState } from "react";

export default function Posts() {
  const { siteId } = useParams();
  const { data: site, isLoading, refetch } = useGetClientSiteById(siteId ?? "");
  const [activePostIndex, setActivePostIndex] = useState<number>(0);
  const [activeShiftIndex, setActiveShiftIndex] = useState<number>(0);
  const [guardModalOpen, setGuardModalOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (!site) return <div>No site data found.</div>;

  const siteData = (site as any).data.siteData || {};
  const posts = siteData.SitePost || [];
  const activePost = posts[activePostIndex] || {};
  const shifts = activePost.shift || [];
  const activeShift = shifts[activeShiftIndex] || {};
  const guardSelections = activeShift.GuardSelection.map((g: any, idx: number) => ({
    id: g.id || idx,
    companyId: g.guardId || "-",
    photo: g.guardReference?.photo || "",
    guardName:
      g.guardReference?.firstName && g.guardReference?.lastName
        ? `${g.guardReference.firstName} ${g.guardReference.lastName}`
        : g.guardReference?.firstName || "-",
    type: g.guardReference?.userType || "-",
    alertnessChallenge: g.alertnessChallenge?.enabled ? "ON" : "OFF",
    alertnessChallengeCount: g.occurenceCount || 0,
    patrollingStatus: g.patrolling ? "ON" : "OFF",
  }));
  const dutyDays = activeShift.daysOfWeek || [];
  const dutyStartTime = activeShift.dutyStartTime || "-";
  const dutyEndTime = activeShift.dutyEndTime || "-";
  const guardsRequired = (activeShift.guardRequirements && activeShift.guardRequirements[0]?.guardCount) || "-";
  const uniformType = (activeShift.guardRequirements && activeShift.guardRequirements[0]?.uniformType) || "-";
  const alertnessEnabled = activeShift.alertnessChallenge?.enabled;
  const alertnessCount = activeShift.alertnessChallenge?.totalCount;
  const patrollingEnabled = activeShift.patrolling?.enabled;
  const patrollingRouteCount = activeShift.patrolling?.routeCount;

  const Sidebar = () => (
    <div className="w-64 border bg-white border-[#F0F0F0] rounded-l-lg min-w-[200px]">
      <List dense disablePadding>
        {posts.map((post: any, index: number) => (
          <ListItem key={post.id} disablePadding>
            <ListItemButton
              selected={activePostIndex === index}
              onClick={() => {
                setActivePostIndex(index);
                setActiveShiftIndex(0);
              }}
              sx={{
                borderRadius: 1,
                "&.Mui-selected": {
                  color: "#2A77D5",
                  backgroundColor: "#F1F7FE",
                },
              }}
            >
              <ListItemText
                primary={post.postName}
                secondary={`Assigned Guards ${post.totalAssignedGuards || 0}`}
                slotProps={{
                  primary: {
                    fontWeight: "bold",
                  },
                }}
              />
              <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const shiftPostId = activeShift.id;
  const initialAssignments = activeShift.GuardSelection || [];

  console.log("initialAssignments", activeShift);
  return (
    <div className="flex flex-col gap-2 bg-white rounded-lg p-2 mt-4 w-full min-h-screen">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Site Posts</h3>
        <Button variant="text" size="small" sx={{ color: "#2A77D5", fontSize: "12px" }}>
          + ADD POST
        </Button>
      </div>
      <div className="flex flex-row w-full min-w-0 flex-1 overflow-x-auto">
        <div className="flex-shrink-0">
          <Sidebar />
        </div>
        <div className="bg-[#F1F7FE] flex-1 min-w-0 rounded-r-lg p-2">
          <div className="bg-white rounded-lg p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Post Details</h3>
              <ModeEditOutlineOutlinedIcon />
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="inline-flex gap-2">
                <span className="text-gray-500">Post Name</span>
                <div className="font-medium">{activePost.postName || "-"}</div>
              </div>
              <div className="inline-flex gap-2">
                <span className="text-gray-500">Post-Geofence Type</span>
                <div className="font-medium">{activePost.geofenceType || "-"}</div>
              </div>
              <div className="inline-flex gap-2">
                <span className="text-gray-500">Total Shifts</span>
                <div className="font-medium">{shifts.length}</div>
              </div>
              <div></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-2 mt-2">
            {/* Shift Tabs */}
            <div className="mb-2">
              <div className="flex gap-2">
                {shifts.map((shift: any, index: number) => (
                  <Button
                    key={shift.id}
                    onClick={() => setActiveShiftIndex(index)}
                    sx={{
                      borderBottom: activeShiftIndex === index ? 3 : 0,
                      borderColor: "#2A77D5",
                      borderRadius: 0,
                      minWidth: 80,
                      px: 1,
                      py: 0.5,
                      fontSize: "13px",
                      "&:hover": {
                        bgcolor: activeShiftIndex === index ? "#1976D2" : "#F5F5F5",
                      },
                    }}
                  >
                    {shift.name || `SHIFT ${index + 1}`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Shift Details */}
            <div className="">
              <div className="mb-2 p-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Shift Details</h4>
                  <ModeEditOutlineOutlinedIcon />
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm mb-2">
                  <div className="inline-flex gap-2">
                    <span className="text-gray-500">Days</span>
                    <div className="font-medium">{dutyDays.length ? dutyDays.join(", ") : "-"}</div>
                  </div>
                  <div className="inline-flex gap-2">
                    <span className="text-gray-500">Shift Timings</span>
                    <div className="font-medium">
                      {dutyStartTime !== "-" && dutyEndTime !== "-" ? `${dutyStartTime} - ${dutyEndTime}` : "-"}
                    </div>
                  </div>
                  <div className="inline-flex gap-2">
                    <span className="text-gray-500">Guards Required</span>
                    <div className="font-medium">{guardsRequired}</div>
                  </div>
                  <div className="inline-flex gap-2">
                    <span className="text-gray-500">Uniform</span>
                    <div className="font-medium">{uniformType}</div>
                  </div>
                </div>

                {/* Alertness Challenge and Patrolling */}
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-semibold text-gray-700">Alertness Challenge</h5>
                      <Edit size={14} className="text-gray-500 cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Status</span>
                        <span className="inline-flex gap-1">
                          <ToggleOnIcon className={alertnessEnabled ? "text-[#5CC168]" : "text-[#A3A3A3]"} />
                          {alertnessEnabled ? "ON" : "OFF"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Occurence Count</span>
                        <span className="font-medium">{alertnessCount ?? "-"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-semibold text-gray-700">Patrolling</h5>
                      <Edit size={14} className="text-gray-500 cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Status</span>
                        <span className="inline-flex gap-1">
                          <ToggleOnIcon className={patrollingEnabled ? "text-[#5CC168]" : "text-[#A3A3A3]"} />
                          {patrollingEnabled ? "ON" : "OFF"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">No. Of Routes</span>
                        <span className="font-medium">{patrollingRouteCount ?? "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guard Requirement */}
              <div className="bg-white rounded-lg p-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Guard Requirement</h4>
                  <Button variant="outlined" size="small" onClick={() => setGuardModalOpen(true)}>
                    <ModeEditOutlineOutlinedIcon fontSize="small" /> Edit Assignment
                  </Button>
                </div>

                <Box sx={{ display: "block", width: "100%", overflowX: "auto", minWidth: 0 }}>
                  <DataGrid
                    rows={guardSelections}
                    columns={guardSelectionsColumns}
                    hideFooter={true}
                    disableRowSelectionOnClick
                    hideFooterSelectedRowCount
                    sx={{
                      borderRadius: "8px",
                      mt: 1,
                    }}
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GuardAssignmentModal
        open={guardModalOpen}
        onClose={() => {
          setGuardModalOpen(false);
          refetch && refetch();
        }}
        shiftPostId={shiftPostId}
        initialAssignments={initialAssignments}
        totalGuardsRequired={guardsRequired}
        sitePosts={posts}
        activePostIndex={activePostIndex}
        activeShiftIndex={activeShiftIndex}
      />
    </div>
  );
}
