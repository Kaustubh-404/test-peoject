import LabeledDropdown from "@components/LabeledDropdown";
import LabeledInput from "@components/LabeledInput";
import { useClientSiteUpdate } from "@modules/clients/apis/hooks/useClientSiteUpdate";
import { useGetAreaOfficers, useGetGuards } from "@modules/clients/apis/hooks/useGuards";
import { usePatchGuardSelection } from "@modules/clients/apis/hooks/usePatchGuardSelection";
import { usePostUpdate } from "@modules/clients/apis/hooks/usePostUpdate";
import { useShiftUpdate } from "@modules/clients/apis/hooks/useShiftUpdate";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { BriefcaseBusiness, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  availableGuardsColumns,
  selectedGuardsColumns,
} from "../../../../modules/clients/columns/GuardSelectionColumns";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#ffffff",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  maxHeight: "95vh",
  overflow: "auto",
  width: "90vw",
  maxWidth: "1200px",
};
const guardsStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#ffffff",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  maxHeight: "95vh",
  overflow: "auto",
  width: "90vw",
};

const GUARD_TYPE_LABELS = {
  SECURITY_GUARD: "SECURITY GUARD",
  GUN_MAN: "GUN MAN",
  LADY_GUARD: "LADY GUARD",
  BOUNCER: "BOUNCER",
  PERSONAL_GUARD: "PERSONAL GUARD",
  HEAD_GUARD: "HEAD GUARD",
  SITE_SUPERVISOR: "SITE SUPERVISOR",
};

interface GuardData {
  id: string;
  companyId: string;
  photo: string;
  guardName: string;
  alertnessChallenge: boolean;
  occurrenceCount: number;
  patrolling: boolean;
}

// Basic Details Modal
export const BasicDetailsModal = ({ open, onClose, siteData }: any) => {
  const { siteId } = useParams();
  const { mutate: updateSite, isPending, error, isSuccess } = useClientSiteUpdate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      siteName: siteData?.siteName || "",
      siteType: siteData?.siteType || [],
    },
  });
  useEffect(() => {
    if (open && siteData) reset({ siteName: siteData.siteName || "", siteType: siteData.siteType || [] });
  }, [open, siteData, reset]);
  useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);
  const onSubmit = (data: any) => {
    if (!siteId) return;
    updateSite({ siteId, data });
  };
  const handleClose = () => {
    reset();
    onClose();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#2A77D5]">Update Basic Details</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full" type="button">
            <X className="w-6 h-6 text-[#2A77D5]" />
          </button>
        </div>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to update site details. Please try again.
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Divider />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <LabeledInput
                label="Site Name"
                name="siteName"
                required
                register={register}
                error={!!errors.siteName}
                helperText={typeof errors.siteName?.message === "string" ? errors.siteName?.message : undefined}
              />
              <LabeledInput
                label="Site Type"
                name="siteType"
                required
                register={register}
                error={!!errors.siteType}
                helperText={typeof errors.siteType?.message === "string" ? errors.siteType?.message : undefined}
              />
            </div>
          </div>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={20} /> : null}
            >
              {isPending ? "Updating..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

// Assigned Officer Modal
export const AssignedOfficerModal = ({ open, onClose, siteData }: any) => {
  const { siteId } = useParams();
  const { mutate: updateSite, isPending, error, isSuccess } = useClientSiteUpdate();
  const { data: areaOfficersData } = useGetAreaOfficers({ page: 1, limit: 100 });
  const areaOfficerOptions = (areaOfficersData?.data?.guards || []).map((officer: any) => ({
    value: officer.guardId,
    label: `${officer.firstName} ${officer.middleName || ""} ${officer.lastName}`.trim(),
    disabled: officer.status !== "ACTIVE",
  }));
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      areaOfficerId: siteData?.areaOfficerId || "",
    },
  });
  useEffect(() => {
    if (open && siteData) reset({ areaOfficerId: siteData.areaOfficerId || "" });
  }, [open, siteData, reset]);
  useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);
  const onSubmit = (data: any) => {
    if (!siteId) return;
    updateSite({ siteId, data });
  };
  const handleClose = () => {
    reset();
    onClose();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#2A77D5]">Update Assigned Officer</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full" type="button">
            <X className="w-6 h-6 text-[#2A77D5]" />
          </button>
        </div>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to update site details. Please try again.
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Divider />
            <div className="grid grid-cols-1 gap-4 mt-4">
              <LabeledDropdown
                label="Assign Area Officer"
                name="areaOfficerId"
                placeholder="Select Area Officer"
                required
                register={register}
                validation={{ required: "Area Officer assignment is required" }}
                options={areaOfficerOptions}
                error={!!errors.areaOfficerId}
                helperText={
                  typeof errors.areaOfficerId?.message === "string"
                    ? errors.areaOfficerId?.message
                    : "Select an area officer to supervise this site"
                }
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setValue("areaOfficerId", e.target.value as string);
                }}
              />
            </div>
          </div>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={20} /> : null}
            >
              {isPending ? "Updating..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

// Contact Person Modal
export const ContactPersonModal = ({ open, onClose, siteData }: any) => {
  const { siteId } = useParams();
  const { mutate: updateSite, isPending, error, isSuccess } = useClientSiteUpdate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      siteContactPersonFullName: siteData?.siteContactPersonFullName || "",
      siteContactDesignation: siteData?.siteContactDesignation || "",
      siteContactPhone: siteData?.siteContactPhone || "",
      siteContactEmail: siteData?.siteContactEmail || "",
    },
  });
  useEffect(() => {
    if (open && siteData)
      reset({
        siteContactPersonFullName: siteData.siteContactPersonFullName || "",
        siteContactDesignation: siteData.siteContactDesignation || "",
        siteContactPhone: siteData.siteContactPhone || "",
        siteContactEmail: siteData.siteContactEmail || "",
      });
  }, [open, siteData, reset]);
  useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);
  const onSubmit = (data: any) => {
    if (!siteId) return;
    updateSite({ siteId, data });
  };
  const handleClose = () => {
    reset();
    onClose();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#2A77D5]">Update Contact Person</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full" type="button">
            <X className="w-6 h-6 text-[#2A77D5]" />
          </button>
        </div>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to update site details. Please try again.
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Divider />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <LabeledInput
                label="Full Name"
                name="siteContactPersonFullName"
                required
                register={register}
                error={!!errors.siteContactPersonFullName}
                helperText={
                  typeof errors.siteContactPersonFullName?.message === "string"
                    ? errors.siteContactPersonFullName?.message
                    : undefined
                }
              />
              <LabeledInput
                label="Designation"
                name="siteContactDesignation"
                required
                register={register}
                error={!!errors.siteContactDesignation}
                helperText={
                  typeof errors.siteContactDesignation?.message === "string"
                    ? errors.siteContactDesignation?.message
                    : undefined
                }
              />
              <LabeledInput
                label="Phone"
                name="siteContactPhone"
                required
                register={register}
                error={!!errors.siteContactPhone}
                helperText={
                  typeof errors.siteContactPhone?.message === "string" ? errors.siteContactPhone?.message : undefined
                }
              />
              <LabeledInput
                label="Email"
                name="siteContactEmail"
                required
                register={register}
                error={!!errors.siteContactEmail}
                helperText={
                  typeof errors.siteContactEmail?.message === "string" ? errors.siteContactEmail?.message : undefined
                }
              />
            </div>
          </div>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={20} /> : null}
            >
              {isPending ? "Updating..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

interface GuardAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  shiftPostId: string;
  initialAssignments?: any[];
  totalGuardsRequired?: number;
  sitePosts?: any[];
  activePostIndex?: number;
  activeShiftIndex?: number;
}

export const GuardAssignmentModal = ({
  open,
  onClose,
  shiftPostId,
  initialAssignments = [],
  totalGuardsRequired = 0,
  sitePosts = [],
  activePostIndex = 0,
  activeShiftIndex = 0,
}: GuardAssignmentModalProps) => {
  const patchGuardSelectionsMutation = usePatchGuardSelection();
  const [selectedGuardIds, setSelectedGuardIds] = useState<string[]>(initialAssignments.map((a: any) => a.guardId));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Selected Guard IDs:", selectedGuardIds);
  });
  // Fetch all guards
  const {
    data: guardsData,
    isLoading: isLoadingGuards,
    error: guardsError,
  } = useGetGuards({
    page: 1,
    limit: 100,
    userType: "GUARD",
    status: "ACTIVE",
    search: searchQuery,
  });

  const allGuards: GuardData[] =
    guardsData?.data?.guards?.map((guard) => ({
      id: guard.guardId,
      companyId: guard.guardId,
      photo: guard.photo || "/api/placeholder/40/40",
      guardName: `${guard.firstName} ${guard.middleName || ""} ${guard.lastName}`.trim(),
      alertnessChallenge: false,
      occurrenceCount: 0,
      patrolling: false,
    })) || [];

  const availableGuards = allGuards.filter((guard) => !selectedGuardIds.includes(guard.id));
  const selectedGuards = allGuards.filter((guard) => selectedGuardIds.includes(guard.id));

  const currentPost = sitePosts[activePostIndex];
  const currentShift = currentPost?.shifts?.[activeShiftIndex];

  const guardRequirements = currentShift?.guardRequirements || [];

  const guardTypesSummary = guardRequirements.map((requirement: { guardType: string; count: number }) => ({
    name: GUARD_TYPE_LABELS[requirement.guardType as keyof typeof GUARD_TYPE_LABELS] || requirement.guardType,
    count: `0/${requirement.count || 0}`,
    guardType: requirement.guardType,
    required: requirement.count || 0,
  }));

  useEffect(() => {
    const checkScrollButtons = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
      }
    };

    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, []);

  const scrollContainer = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleRemoveGuard = (guardId: string) => {
    setSelectedGuardIds((prev) => prev.filter((id) => id !== guardId));
  };

  const handleAvailableGuardsSelection = (newSelection: any) => {
    let selectedIds: string[] = [];
    if (Array.isArray(newSelection)) {
      selectedIds = newSelection.map((id) => String(id));
    } else if (newSelection && typeof newSelection === "object") {
      if ("ids" in newSelection && newSelection.ids instanceof Set) {
        selectedIds = Array.from(newSelection.ids).map((id) => String(id));
      } else if ("ids" in newSelection && Array.isArray(newSelection.ids)) {
        selectedIds = (newSelection.ids as (string | number)[]).map((id: string | number) => String(id));
      } else {
        selectedIds = Object.keys(newSelection).filter(
          (key) => key !== "type" && newSelection[key as keyof typeof newSelection]
        );
      }
    }
    // Limit selection to guardsRequired
    let allSelected = [...new Set([...selectedGuardIds, ...selectedIds])];
    if (allSelected.length > guardsRequired) {
      allSelected = allSelected.slice(0, guardsRequired);
    }
    setSelectedGuardIds(allSelected);
  };

  const selectedGuardsColumnsWithRemove: GridColDef[] = [
    ...selectedGuardsColumns,
    {
      field: "remove",
      headerName: "Remove",
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <Button color="error" size="small" onClick={() => handleRemoveGuard(params.row.id)} variant="outlined">
          Remove
        </Button>
      ),
    },
  ];

  // Use only totalGuardsRequired from props
  const guardsRequired = totalGuardsRequired;

  const handleClose = () => {
    setSelectedGuardIds(initialAssignments.map((a: any) => a.guardId));
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const assignments = allGuards
        .map((guard) => {
          if (selectedGuardIds.includes(guard.id)) {
            return {
              guardId: guard.id,
              action: "ASSIGN",
              occurenceCount: 0,
              patrolling: false,
              alertnessChallenge: false,
            };
          } else if (initialAssignments.some((a: any) => a.guardId === guard.id)) {
            return {
              guardId: guard.id,
              action: "UNASSIGN",
            };
          }
          return null;
        })
        .filter(Boolean);
      await patchGuardSelectionsMutation.mutateAsync({ shiftPostId: shiftPostId, assignments });
      onClose();
    } catch (err: any) {
      setError("Failed to update guard assignments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={guardsStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#2A77D5]">GUARD SELECTION</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full" type="button">
            <X className="w-6 h-6 text-[#2A77D5]" />
          </button>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <div className="flex flex-row">
          <div className="">
            <div className="flex gap-2 mb-4">
              {currentPost?.shifts?.map((_: any, index: number) => {
                const shiftLabel = `Shift ${index + 1}`;
                return (
                  <Button
                    key={index}
                    variant="contained"
                    onClick={() => {}}
                    sx={{
                      bgcolor: activeShiftIndex === index ? "#2A77D5" : "white",
                      color: activeShiftIndex === index ? "white" : "#2A77D5",
                      "&:hover": {
                        bgcolor: activeShiftIndex === index ? "#1e5ba8" : "#f5f5f5",
                      },
                    }}
                  >
                    <BriefcaseBusiness
                      className={`mr-2 text-${activeShiftIndex === index ? "white" : "[#2A77D5]"}`}
                      size={16}
                    />
                    {shiftLabel}
                  </Button>
                );
              })}
            </div>

            <div>
              <span className="text-[#A3A3A3]">Guards Required: </span>
              <span>{totalGuardsRequired}</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center max-w-[64vw] mx-auto mb-4">
                <button
                  onClick={() => scrollContainer("left")}
                  type="button"
                  disabled={!canScrollLeft}
                  className={`flex-shrink-0 p-2 rounded-l-lg transition-colors ${
                    canScrollLeft
                      ? "text-[#2A77D5] hover:bg-blue-50 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto scrollbar-hide py-2 px-1 flex-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <style>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {guardTypesSummary.map((guard: any, index: number) => (
                    <div
                      key={index}
                      className="flex-shrink-0 px-4 py-2 mx-1 text-center cursor-pointer hover:bg-blue-50 rounded transition-colors min-w-max"
                    >
                      <div className="text-[#2A77D5] whitespace-nowrap">
                        {guard.name} ({guard.count})
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => scrollContainer("right")}
                  type="button"
                  disabled={!canScrollRight}
                  className={`flex-shrink-0 p-2 rounded-r-lg transition-colors ${
                    canScrollRight
                      ? "text-[#2A77D5] hover:bg-blue-50 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-row gap-4">
                  <div className="bg-[#F7F7F7] p-2 rounded-lg flex flex-col gap-2">
                    <span className="text-sm text-[#707070] font-semibold">
                      AVAILABLE GUARDS ({availableGuards.length})
                    </span>
                    <div className="relative w-auto">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-[#2A77D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Search Guards"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-gray-700 bg-white border-2 border-blue-100 rounded-lg 
                           placeholder-gray-400 focus:outline-none focus:border-[#C2DBFA] hover:border-blue-200 
                           transition-colors duration-200 text-base"
                        />
                      </div>
                    </div>
                    <Box sx={{ display: "inline-block" }}>
                      {isLoadingGuards ? (
                        <div className="flex items-center justify-center h-48">
                          <CircularProgress />
                          <span className="ml-2 text-gray-500">Loading guards...</span>
                        </div>
                      ) : guardsError ? (
                        <div className="flex items-center justify-center h-48">
                          <span className="text-red-500">Failed to load guards. Please try again.</span>
                        </div>
                      ) : (
                        <DataGrid
                          key={`available-guards-${availableGuards.length}`}
                          rows={availableGuards}
                          columns={availableGuardsColumns}
                          hideFooter={true}
                          hideFooterSelectedRowCount
                          checkboxSelection
                          onRowSelectionModelChange={handleAvailableGuardsSelection}
                          isRowSelectable={(params) =>
                            selectedGuardIds.length < totalGuardsRequired || selectedGuardIds.includes(params.row.id)
                          }
                          sx={{
                            width: "100%",
                            minWidth: 400,
                            maxWidth: "100%",
                            ".MuiDataGrid-columnHeaders": {
                              backgroundColor: "#f5f5f5",
                            },
                            border: 0,
                          }}
                          slots={{
                            noRowsOverlay: () => (
                              <div className="flex items-center justify-center h-full text-gray-500">
                                {searchQuery ? "No guards found matching your search" : "No guards available"}
                              </div>
                            ),
                          }}
                        />
                      )}
                    </Box>
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <span className="text-sm text-[#707070] font-semibold">
                      SELECTED GUARDS ({selectedGuards.length}/{guardsRequired})
                    </span>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <DataGrid
                        rows={selectedGuards}
                        columns={selectedGuardsColumnsWithRemove}
                        hideFooter={true}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        hideFooterSelectedRowCount
                        disableRowSelectionOnClick
                        sx={{
                          width: "100%",
                          minWidth: 400,
                          ".MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                            whiteSpace: "break-spaces",
                          },
                          minHeight: 300,
                        }}
                        slots={{
                          noRowsOverlay: () => (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              No guards selected
                            </div>
                          ),
                        }}
                      />
                    </Box>
                  </div>
                </div>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                  <Button variant="outlined" onClick={handleClose} disabled={loading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </Button>
                </Box>
              </form>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

// Post Details Modal
export const PostDetailsModal = ({ open, onClose, postData, onSuccess }: any) => {
  const { mutate: updatePost, isPending, error, isSuccess } = usePostUpdate();
  // const { data: areaOfficersData } = useGetAreaOfficers({ page: 1, limit: 100 });
  // const areaOfficerOptions = (areaOfficersData?.data?.guards || []).map((officer: any) => ({
  //   value: officer.guardId,
  //   label: `${officer.firstName} ${officer.middleName || ""} ${officer.lastName}`.trim(),
  //   disabled: officer.status !== "ACTIVE",
  // }));

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      postName: postData?.postName || "",
      geofenceType: postData?.geofenceType || "CIRCLE",
      // areaOfficerId: postData?.areaOfficerId || "",
    },
  });

  useEffect(() => {
    if (open && postData) {
      reset({
        postName: postData.postName || "",
        geofenceType: postData.geofenceType || "CIRCLE",
        // areaOfficerId: postData.areaOfficerId || "",
      });
    }
  }, [open, postData, reset]);

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const onSubmit = (data: any) => {
    if (!postData?.id) return;
    // Remove areaOfficerId from the data being sent
    const { areaOfficerId, ...dataToSend } = data;
    updatePost({ postId: postData.id, data: dataToSend });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#2A77D5]">Update Post Details</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full" type="button">
            <X className="w-6 h-6 text-[#2A77D5]" />
          </button>
        </div>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to update post details. Please try again.
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Divider />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <LabeledInput
                label="Post Name"
                name="postName"
                required
                register={register}
                error={!!errors.postName}
                helperText={typeof errors.postName?.message === "string" ? errors.postName?.message : undefined}
              />
              <LabeledDropdown
                label="Geofence Type"
                name="geofenceType"
                placeholder="Select Geofence Type"
                required
                register={register}
                validation={{ required: "Geofence type is required" }}
                options={[
                  { value: "CIRCLE", label: "Circular Geofence" },
                  { value: "POLYGON", label: "Polygon Geofence" },
                ]}
                error={!!errors.geofenceType}
                helperText={
                  typeof errors.geofenceType?.message === "string"
                    ? errors.geofenceType?.message
                    : "Select the geofence shape for this post"
                }
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setValue("geofenceType", e.target.value as string);
                }}
              />
            </div>
            {/* Commented out area officer assignment */}
            {/* <div className="grid grid-cols-1 gap-4 mt-2">
              <LabeledDropdown
                label="Assign Area Officer"
                name="areaOfficerId"
                placeholder="Select Area Officer"
                register={register}
                options={areaOfficerOptions}
                error={!!errors.areaOfficerId}
                helperText={
                  typeof errors.areaOfficerId?.message === "string"
                    ? errors.areaOfficerId?.message
                    : "Select an area officer for this post (optional)"
                }
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setValue("areaOfficerId", e.target.value as string);
                }}
              />
            </div> */}
          </div>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={20} /> : null}
            >
              {isPending ? "Updating..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

// Shift Details Modal
export const ShiftDetailsModal = ({ open, onClose, shiftData, onSuccess }: any) => {
  const { mutate: updateShift, isPending, error, isSuccess } = useShiftUpdate();
  // const { data: areaOfficersData } = useGetAreaOfficers({ page: 1, limit: 100 });
  // const areaOfficerOptions = (areaOfficersData?.data?.guards || []).map((officer: any) => ({
  //   value: officer.guardId,
  //   label: `${officer.firstName} ${officer.middleName || ""} ${officer.lastName}`.trim(),
  //   disabled: officer.status !== "ACTIVE",
  // }));

  const daysOfWeekOptions = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      daysOfWeek: shiftData?.daysOfWeek || [],
      dutyStartTime: shiftData?.dutyStartTime || "",
      dutyEndTime: shiftData?.dutyEndTime || "",
      checkInTime: shiftData?.checkInTime || "",
      latenessFrom: shiftData?.latenessFrom || "",
      latenessTo: shiftData?.latenessTo || "",
      includePublicHolidays: shiftData?.includePublicHolidays || false,
      // areaOfficerId: shiftData?.areaOfficerId || "",
    },
  });

  useEffect(() => {
    if (open && shiftData) {
      reset({
        daysOfWeek: shiftData.daysOfWeek || [],
        dutyStartTime: shiftData.dutyStartTime || "",
        dutyEndTime: shiftData.dutyEndTime || "",
        checkInTime: shiftData.checkInTime || "",
        latenessFrom: shiftData.latenessFrom || "",
        latenessTo: shiftData.latenessTo || "",
        includePublicHolidays: shiftData.includePublicHolidays || false,
        // areaOfficerId: shiftData.areaOfficerId || "",
      });
    }
  }, [open, shiftData, reset]);

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const selectedDays = watch("daysOfWeek");

  const onSubmit = (data: any) => {
    if (!shiftData?.id) return;
    // Remove areaOfficerId from the data being sent
    const { areaOfficerId, ...dataToSend } = data;
    updateShift({ shiftId: shiftData.id, data: dataToSend });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDayChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setValue("daysOfWeek", typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#2A77D5]">Update Shift Details</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full" type="button">
            <X className="w-6 h-6 text-[#2A77D5]" />
          </button>
        </div>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to update shift details. Please try again.
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Divider />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Controller
                name="daysOfWeek"
                control={control}
                render={() => (
                  <FormControl fullWidth>
                    <InputLabel id="days-of-week-label">Days of Week</InputLabel>
                    <Select
                      labelId="days-of-week-label"
                      multiple
                      value={selectedDays}
                      onChange={handleDayChange}
                      input={<OutlinedInput label="Days of Week" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip
                              key={value}
                              label={daysOfWeekOptions.find((d) => d.value === value)?.label || value}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {daysOfWeekOptions.map((day) => (
                        <MenuItem key={day.value} value={day.value}>
                          {day.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <LabeledDropdown
                label="Include Public Holidays"
                name="includePublicHolidays"
                placeholder="Include Holidays"
                register={register}
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                error={!!errors.includePublicHolidays}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setValue("includePublicHolidays", e.target.value === "true");
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <LabeledInput
                label="Duty Start Time"
                name="dutyStartTime"
                type="time"
                required
                register={register}
                error={!!errors.dutyStartTime}
                helperText={
                  typeof errors.dutyStartTime?.message === "string" ? errors.dutyStartTime?.message : undefined
                }
              />
              <LabeledInput
                label="Duty End Time"
                name="dutyEndTime"
                type="time"
                required
                register={register}
                error={!!errors.dutyEndTime}
                helperText={typeof errors.dutyEndTime?.message === "string" ? errors.dutyEndTime?.message : undefined}
              />
              <LabeledInput
                label="Check-in Time"
                name="checkInTime"
                type="time"
                register={register}
                error={!!errors.checkInTime}
                helperText={
                  typeof errors.checkInTime?.message === "string"
                    ? errors.checkInTime?.message
                    : "Latest allowed check-in time"
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <LabeledInput
                label="Lateness From"
                name="latenessFrom"
                type="time"
                register={register}
                error={!!errors.latenessFrom}
                helperText={
                  typeof errors.latenessFrom?.message === "string"
                    ? errors.latenessFrom?.message
                    : "Start of lateness calculation window"
                }
              />
              <LabeledInput
                label="Lateness To"
                name="latenessTo"
                type="time"
                register={register}
                error={!!errors.latenessTo}
                helperText={
                  typeof errors.latenessTo?.message === "string"
                    ? errors.latenessTo?.message
                    : "End of lateness calculation window"
                }
              />
            </div>
            {/* Commented out area officer assignment */}
            {/* <div className="grid grid-cols-1 gap-4 mt-2">
              <LabeledDropdown
                label="Assign Area Officer"
                name="areaOfficerId"
                placeholder="Select Area Officer"
                register={register}
                options={areaOfficerOptions}
                error={!!errors.areaOfficerId}
                helperText={
                  typeof errors.areaOfficerId?.message === "string"
                    ? errors.areaOfficerId?.message
                    : "Select an area officer for this shift (optional)"
                }
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setValue("areaOfficerId", e.target.value as string);
                }}
              />
            </div> */}
          </div>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={20} /> : null}
            >
              {isPending ? "Updating..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

// Patrolling Modal
export const PatrollingModal = ({ open, onClose, postData, onSuccess }: any) => {
  const { siteId } = useParams();
  const { mutate: updateSite, isPending, error, isSuccess } = useClientSiteUpdate();
  const [localPatrollingEnabled, setLocalPatrollingEnabled] = useState(false);

  // Initialize local state when modal opens
  useEffect(() => {
    if (open && postData) {
      setLocalPatrollingEnabled(postData?.patrolling || false);
    }
  }, [open, postData]);

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const handlePatrollingToggle = () => {
    setLocalPatrollingEnabled(!localPatrollingEnabled);
  };

  const handleSave = async () => {
    if (!siteId) return;
    updateSite({
      siteId,
      data: { patrolling: localPatrollingEnabled },
    });
  };

  const handleClose = () => {
    // Reset to original value on close without saving
    setLocalPatrollingEnabled(postData?.patrolling || false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#ffffff",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          width: "400px",
          maxWidth: "90vw",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#2A77D5]">Patrolling Settings</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full" type="button">
            <X className="w-6 h-6 text-[#2A77D5]" />
          </button>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to update patrolling settings. Please try again.
          </Alert>
        )}

        <div className="flex flex-col gap-4">
          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Enable Patrolling</h3>
              <p className="text-sm text-gray-500">
                {localPatrollingEnabled ? "Patrolling will be enabled" : "Patrolling will be disabled"}
              </p>
            </div>

            <button
              onClick={handlePatrollingToggle}
              className="inline-flex gap-2 w-fit items-center cursor-pointer hover:opacity-70 transition-opacity"
              disabled={isPending}
            >
              {localPatrollingEnabled ? (
                <ToggleOnIcon className="text-[#5CC168]" />
              ) : (
                <ToggleOffIcon className="text-[#A3A3A3]" />
              )}
              {localPatrollingEnabled ? "ON" : "OFF"}
            </button>
          </div>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={20} /> : null}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};
