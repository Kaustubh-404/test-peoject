import TaskNoteModal from "@modules/clients/components/modals/TaskNoteModal";
import { datagridStyle } from "@modules/clients/lib/datagridStyle";
import { Avatar, Box } from "@mui/material";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";

interface GuardDetailsRow {
  id: number;
  guardName: string;
  guardPhoto: string;
  assignedBy: string;
  taskTime: string;
  taskDate: string;
}

export const guardDetailsColumns: GridColDef[] = [
  {
    field: "guardName",
    headerName: "GUARD NAME",
    minWidth: 180,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      return (
        <div className="flex w-full h-full items-center gap-4">
          <Avatar
            src={params.row.guardPhoto}
            alt={params.value}
            sx={{
              width: 40,
              height: 40,
              border: "2px solid #e0e0e0",
            }}
          />
          <span>{params.value}</span>
        </div>
      );
    },
  },
  {
    field: "assignedBy",
    headerName: "ASSIGNED BY",
    width: 150,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "taskTime",
    headerName: "TASK TIME",
    width: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return (
        <div className="flex flex-col w-full h-full">
          <span> {params.row.taskDate}</span>
          <span> {params.value}</span>
        </div>
      );
    },
  },
  {
    field: "note",
    headerName: "NOTE",
    width: 80,
    align: "center",
    headerAlign: "center",
    renderCell: () => {
      const [modalVisible, setModalVisible] = useState<boolean>(false);
      return (
        <div>
          <button onClick={() => setModalVisible(true)} className="bg-white rounded-full text-[#2A77D5] shadow-lg p-2">
            <SquarePen />
          </button>
          <TaskNoteModal open={modalVisible} onClose={() => setModalVisible(false)} viewMode="task" />
        </div>
      );
    },
  },
];

export const guardDetailsData: GuardDetailsRow[] = [
  {
    id: 1,
    guardName: "Raju Kumar",
    guardPhoto: "/guards/raju-kumar.jpg",
    assignedBy: "Area officer",
    taskTime: "04:56 PM",
    taskDate: "12/01/25",
  },
  {
    id: 2,
    guardName: "Bitto Singh",
    guardPhoto: "/guards/bitto-singh.jpg",
    assignedBy: "Client",
    taskTime: "04:56 PM",
    taskDate: "12/01/25",
  },
  {
    id: 3,
    guardName: "Ramu Kumar",
    guardPhoto: "/guards/ramu-kumar.jpg",
    assignedBy: "Area officer",
    taskTime: "04:56 PM",
    taskDate: "12/01/25",
  },
  {
    id: 4,
    guardName: "Shimpu",
    guardPhoto: "/guards/shimpu.jpg",
    assignedBy: "Area officer",
    taskTime: "04:56 PM",
    taskDate: "12/01/25",
  },
];
interface GuardTasksRow {
  id: number;
  siteId: string;
  siteName: string;
  tasks: number;
}

export const guardTasksColumns: GridColDef[] = [
  {
    field: "siteId",
    headerName: "SITE ID",
    width: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <span style={{ fontSize: "16px", fontWeight: 500 }}>{params.value}</span>,
  },
  {
    field: "siteName",
    headerName: "SITE NAME",
    flex: 1,
    minWidth: 200,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => <span style={{ fontSize: "16px", fontWeight: 500 }}>{params.value}</span>,
  },
  {
    field: "tasks",
    headerName: "TASKS",
    width: 120,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <span
        style={{
          fontSize: "16px",
          fontWeight: 500,
        }}
      >
        {String(params.value).padStart(2, "0")}
      </span>
    ),
  },
];

export const guardTasksData: GuardTasksRow[] = [
  {
    id: 1,
    siteId: "12443",
    siteName: "Nehru Place",
    tasks: 4,
  },
  {
    id: 2,
    siteId: "12444",
    siteName: "GK 2",
    tasks: 3,
  },
];

export default function GuardsTasks() {
  // State for selected guard index and selected guard details
  const [selectedGuardIndex] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });
  const [selectedGuard, setSelectedGuard] = useState<GuardTasksRow | null>(null);

  useEffect(() => {
    console.log(selectedGuard);
  }, [selectedGuard]);
  return (
    <div className="flex flex-row w-full">
      <div className="bg-white my-4 p-4 rounded-lg flex flex-col gap-4 w-full items-center">
        <h2 className="font-semibold">GUARDS : TASKS</h2>
        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            minHeight: 400,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DataGrid
            rows={guardTasksData}
            columns={guardTasksColumns}
            hideFooter={true}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              const selectedId = Array.from(newRowSelectionModel.ids)[0];
              if (selectedId !== undefined) {
                setSelectedGuard(guardTasksData[Number(selectedId)] as GuardTasksRow);
              }
            }}
            rowSelectionModel={selectedGuardIndex}
            disableColumnMenu
            disableMultipleRowSelection={true}
            sx={datagridStyle}
          />
        </Box>
      </div>
      <div className="bg-white my-4 p-4 rounded-lg flex flex-col gap-4 w-full border-l border-gray-200 items-center">
        <h2 className="font-semibold">DETAILS</h2>
        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            minHeight: 400,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DataGrid
            rows={guardDetailsData}
            columns={guardDetailsColumns}
            hideFooter={true}
            disableColumnMenu
            disableRowSelectionOnClick
            sx={datagridStyle}
          />
        </Box>
      </div>
    </div>
  );
}
