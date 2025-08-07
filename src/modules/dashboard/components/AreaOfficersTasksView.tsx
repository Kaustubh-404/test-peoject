import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useState } from "react";

interface TaskData {
  id: string;
  name: string;
  clientName: string;
  siteName: string;
  dueOn: string;
  assignedBy: string;
}

const overdueTasksData: TaskData[] = [
  {
    id: "12443",
    name: "Hamir Ali",
    clientName: "Haldiram's",
    siteName: "GK2",
    dueOn: "23/01/25 04:35 PM",
    assignedBy: "Office",
  },
  {
    id: "12453",
    name: "Shyam Gopal",
    clientName: "Jain Books",
    siteName: "GK2",
    dueOn: "23/01/25 04:35 PM",
    assignedBy: "Office",
  },
];

const pendingTasksData: TaskData[] = [
  {
    id: "12444",
    name: "Anil Sharma",
    clientName: "Hardik Jeweller",
    siteName: "GK2",
    dueOn: "23/01/25 04:35 PM",
    assignedBy: "Office",
  },
  {
    id: "12467",
    name: "Raju Kumar",
    clientName: "Axis Bank",
    siteName: "Nehru Place",
    dueOn: "23/01/25 04:35 PM",
    assignedBy: "Office",
  },
];

const doneTasksData: TaskData[] = [
  {
    id: "12441",
    name: "Ramesh Kumar",
    clientName: "Tech Corp",
    siteName: "Connaught Place",
    dueOn: "22/01/25 02:30 PM",
    assignedBy: "Office",
  },
  {
    id: "12442",
    name: "Suresh Singh",
    clientName: "Metro Mall",
    siteName: "Lajpat Nagar",
    dueOn: "22/01/25 01:15 PM",
    assignedBy: "Office",
  },
  {
    id: "12445",
    name: "Vikash Gupta",
    clientName: "City Center",
    siteName: "Karol Bagh",
    dueOn: "21/01/25 06:45 PM",
    assignedBy: "Office",
  },
  {
    id: "12446",
    name: "Manoj Sharma",
    clientName: "Business Hub",
    siteName: "Dwarka",
    dueOn: "21/01/25 03:20 PM",
    assignedBy: "Office",
  },
];

export default function AreaOfficersTasksView() {
  const [activeTab, setActiveTab] = useState<"overdue" | "pending" | "done">("overdue");

  const getCurrentData = () => {
    switch (activeTab) {
      case "overdue":
        return overdueTasksData;
      case "pending":
        return pendingTasksData;
      case "done":
        return doneTasksData;
      default:
        return overdueTasksData;
    }
  };

  const getActionIcons = (taskStatus: string) => {
    switch (taskStatus) {
      case "overdue":
        return (
          <div className="flex justify-center gap-4">
            <HomeOutlinedIcon sx={{ color: "#2A77D5" }} />
            <PersonOutlinedIcon sx={{ color: "#2A77D5" }} />
            <ReceiptOutlinedIcon sx={{ color: "#2A77D5" }} />
          </div>
        );
      case "pending":
        return (
          <div className="flex justify-center gap-4">
            <HomeOutlinedIcon sx={{ color: "#2A77D5" }} />
            <PersonOutlinedIcon sx={{ color: "#2A77D5" }} />
            <ReceiptOutlinedIcon sx={{ color: "#2A77D5" }} />
          </div>
        );
      case "done":
        return (
          <div className="flex justify-center gap-4">
            <CheckCircleIcon sx={{ color: "#2A77D5" }} />
            <ReceiptOutlinedIcon sx={{ color: "#2A77D5" }} />
          </div>
        );
      default:
        return (
          <div className="flex justify-center gap-4">
            <HomeOutlinedIcon sx={{ color: "#2A77D5" }} />
            <PersonOutlinedIcon sx={{ color: "#2A77D5" }} />
          </div>
        );
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="bg-white flex flex-col p-6 rounded-lg h-full">
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab("overdue")}
          className={`flex flex-row items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors min-w-[120px] justify-center ${
            activeTab === "overdue" ? "bg-[#2A77D5] text-white" : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          <WarningAmberOutlinedIcon fontSize="small" />
          OVERDUE (02)
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex flex-row items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors min-w-[120px] justify-center ${
            activeTab === "pending" ? "bg-[#2A77D5] text-white" : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          <HistoryToggleOffIcon fontSize="small" />
          PENDING (02)
        </button>
        <button
          onClick={() => setActiveTab("done")}
          className={`flex flex-row items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors min-w-[120px] justify-center ${
            activeTab === "done" ? "bg-[#2A77D5] text-white" : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          <CheckCircleIcon fontSize="small" />
          DONE (04)
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 rounded-t-lg border-b">
          <div className="text-gray-600 font-semibold text-sm">TASK ID</div>
          <div className="text-gray-600 font-semibold text-sm">NAME</div>
          <div className="text-gray-600 font-semibold text-sm">CLIENT NAME</div>
          <div className="text-gray-600 font-semibold text-sm">SITE NAME</div>
          <div className="text-gray-600 font-semibold text-sm">DUE ON</div>
          <div className="text-gray-600 font-semibold text-sm">ASSIGNED BY</div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          {currentData.map((task, index) => (
            <div key={index} className="border border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-6 gap-4 px-4 py-3 items-center">
                <div className="text-gray-800 font-medium">{task.id}</div>
                <div className="text-gray-800 font-medium">{task.name}</div>
                <div className="text-gray-800 font-medium">{task.clientName}</div>
                <div className="text-gray-800 font-medium">{task.siteName}</div>
                <div className="text-gray-800 font-medium">
                  <div>{task.dueOn}</div>
                </div>
                <div className="text-gray-800 font-medium">{task.assignedBy}</div>
              </div>

              <div className="bg-blue-50 px-4 py-3 border-t border-gray-200">{getActionIcons(activeTab)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
