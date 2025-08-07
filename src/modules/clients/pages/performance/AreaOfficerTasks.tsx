import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { useState } from "react";
import { useParams } from "react-router-dom";
interface AreaOfficersTasksData {
  id: string;
  clientName: string;
  siteName: string;
  time: string;
  date: string;
}

const areaOfficersTasksData: AreaOfficersTasksData[] = [
  {
    id: "12443",
    clientName: "Axis Bank",
    siteName: "Nehru Place",
    time: "04:35 PM",
    date: "23/01/25",
  },
  {
    id: "12443",
    clientName: "Axis Bank",
    siteName: "Nehru Place",
    time: "04:35 PM",
    date: "23/01/25",
  },
  {
    id: "12443",
    clientName: "Axis Bank",
    siteName: "Nehru Place",
    time: "04:35 PM",
    date: "23/01/25",
  },
];

export default function AreaOfficersTasks() {
  const [activeTab, setActiveTab] = useState<"overdue" | "pending" | "done">("pending");
  const { clientId, siteId } = useParams();

  return (
    <div className="pt-4">
      <div className="bg-white flex flex-col p-4 rounded-lg items-center gap-4">
        <h2 className="font-semibold">AREA OFFICERS : TASKS</h2>
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("overdue")}
            className={`flex flex-row items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors w-[12vw] h-fit justify-center ${
              activeTab === "overdue" ? "bg-[#2A77D5] text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <ReportProblemOutlinedIcon />
            overdue (02)
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex flex-row items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors w-[12vw] h-fit justify-center ${
              activeTab === "pending" ? "bg-[#2A77D5] text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <CheckCircleIcon />
            pending (02)
          </button>
          <button
            onClick={() => setActiveTab("done")}
            className={`flex flex-row items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors w-[12vw] h-fit justify-center ${
              activeTab === "done" ? "bg-[#2A77D5] text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <CheckCircleIcon />
            done (02)
          </button>
        </div>
        <div className="overflow-hidden whitespace-nowrap text-left w-[36vw]">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 px-2 py-2">
            <div className="text-gray-600 font-medium text-sm">INCIDENT ID</div>
            <div className="text-gray-600 font-medium text-sm">SITE NAME</div>
            <div className="text-gray-600 font-medium text-sm">TIME</div>
          </div>
          <div className="flex flex-col gap-2">
            {areaOfficersTasksData.map((task, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Table Data Row */}
                <div className="grid grid-cols-3 gap-4 px-2 py-2 bg-white items-center">
                  <div className="text-gray-800 font-medium">{task.id}</div>
                  <a href={`/clients/${clientId}/performance/area-officers-tasks/${siteId}`}>
                    <div className="text-gray-800 font-medium">{task.siteName}</div>
                  </a>
                  <div className="text-gray-800 font-medium">
                    <div>{task.date}</div>
                    <div>{task.time}</div>
                  </div>
                </div>

                {/* Action Icons Row */}
                <div className="bg-blue-50 px-6 py-2 border-t border-gray-200">
                  <div className="flex justify-center gap-4">
                    <button className="">
                      <LocalFireDepartmentOutlinedIcon sx={{ color: "#2A77D5" }} />
                    </button>
                    <button className="">
                      <HomeOutlinedIcon sx={{ color: "#2A77D5" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
