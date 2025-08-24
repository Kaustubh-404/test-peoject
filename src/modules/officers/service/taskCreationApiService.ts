// File: src/modules/officers/service/taskCreationApiService.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../../config/axios";

// API Request interfaces
export interface CreateTaskRequest {
  clientId?: string;
  siteId?: string;
  customLocation?: string;
  areaOfficerId: string;
  deadline: string; // ISO string format
  subtasks: TaskSubtaskType[];
}

export interface CreateTaskResponse {
  success: boolean;
  data: {
    id: string;
    clientId?: string;
    siteId?: string;
    customLocation?: string;
    areaOfficerId: string;
    deadline: string;
    status: "PENDING" | "INPROGRESS" | "COMPLETED";
    subtasks: {
      id: string;
      type: TaskSubtaskType;
      isCompleted: boolean;
    }[];
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
}

// Task subtask types from API
export type TaskSubtaskType = "SITE_VISIT" | "INSPECTION" | "DOCUMENT" | "TRAINING" | "OTHER";

// Frontend form data types
export interface TaskFormData {
  taskLocation: {
    selectedSites: Array<{
      siteId: string;
      clientId: string;
      siteName: string;
      clientName: string;
    }>;
    customLocation?: string;
    isCustomLocation: boolean;
  };
  taskSelection: {
    selectedTasks: string[];
  };
  taskDeadline: {
    dueDate: string; // YYYY-MM-DD format
    dueTime: string; // HH:MM format
    amPm: "AM" | "PM";
  };
}

// Map frontend task types to API subtask types
const mapTaskTypeToSubtask = (taskType: string): TaskSubtaskType => {
  const mapping: Record<string, TaskSubtaskType> = {
    site_visit: "SITE_VISIT",
    inspection: "INSPECTION",
    document: "DOCUMENT",
    training: "TRAINING",
    other: "OTHER",
  };

  return mapping[taskType] || "OTHER";
};

// Convert form date/time to ISO string
const formatDeadlineToISO = (dueDate: string, dueTime: string, amPm: "AM" | "PM"): string => {
  if (!dueDate || !dueTime || !amPm) {
    throw new Error("Invalid date/time format");
  }

  // Parse time
  const [hours, minutes] = dueTime.split(":").map((num) => parseInt(num));
  let hour24 = hours;

  // Convert to 24-hour format
  if (amPm === "PM" && hours !== 12) {
    hour24 = hours + 12;
  } else if (amPm === "AM" && hours === 12) {
    hour24 = 0;
  }

  // Create ISO string (assuming local timezone)
  const dateTime = new Date(dueDate);
  dateTime.setHours(hour24, minutes, 0, 0);

  return dateTime.toISOString();
};

// Transform form data to API request format
const transformFormDataToApiRequest = (formData: TaskFormData, areaOfficerId: string): CreateTaskRequest => {
  const { taskLocation, taskSelection, taskDeadline } = formData;

  // Convert deadline to ISO format
  const deadline = formatDeadlineToISO(taskDeadline.dueDate, taskDeadline.dueTime, taskDeadline.amPm);

  // Convert selected tasks to subtasks
  const subtasks = taskSelection.selectedTasks.map(mapTaskTypeToSubtask);

  // Base request
  const request: CreateTaskRequest = {
    areaOfficerId,
    deadline,
    subtasks,
  };

  // Add location data based on selection type
  if (taskLocation.isCustomLocation && taskLocation.customLocation) {
    request.customLocation = taskLocation.customLocation.trim();
  } else if (taskLocation.selectedSites.length > 0) {
    // For now, use the first selected site (can be enhanced for multiple sites)
    const selectedSite = taskLocation.selectedSites[0];
    request.clientId = selectedSite.clientId;
    request.siteId = selectedSite.siteId;
  } else {
    throw new Error("Please select a location or provide a custom location");
  }

  return request;
};

// API call function for creating a task
const createTask = async (taskData: CreateTaskRequest): Promise<CreateTaskResponse> => {
  console.log(`🔄 Creating task via DUTY API v2:`, taskData);

  const response = await authApi.post<CreateTaskResponse>("/tasks", taskData);

  if (!response.data.success) {
    throw new Error("Failed to create task");
  }

  console.log(`✅ Successfully created task:`, {
    taskId: response.data.data.id,
    areaOfficerId: response.data.data.areaOfficerId,
    deadline: response.data.data.deadline,
    subtasksCount: response.data.data.subtasks.length,
  });

  return response.data;
};

// TanStack Query Keys for Task Creation
export const taskCreationQueryKeys = {
  all: ["taskCreation"] as const,
};

// Custom hook for creating tasks with TanStack Query
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, areaOfficerId }: { formData: TaskFormData; areaOfficerId: string }) => {
      const apiRequest = transformFormDataToApiRequest(formData, areaOfficerId);
      return createTask(apiRequest);
    },

    onMutate: async ({ formData, areaOfficerId }) => {
      console.log(`🔄 Starting task creation for area officer: ${areaOfficerId}`, formData);
    },

    onSuccess: (data, { areaOfficerId }) => {
      console.log(`✅ Task created successfully for area officer: ${areaOfficerId}`, data);

      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["siteTasks", "areaOfficer", areaOfficerId],
      });

      // If task was created for a specific site, also invalidate site-specific queries
      if (data.data.siteId) {
        queryClient.invalidateQueries({
          queryKey: ["siteTasks", "areaOfficer", areaOfficerId, "site", data.data.siteId],
        });
      }
    },

    onError: (error: any, { formData, areaOfficerId }) => {
      console.error(`❌ Failed to create task for area officer: ${areaOfficerId}`, {
        error: error.message,
        formData,
        responseData: error.response?.data,
      });
    },

    onSettled: (data, error, { areaOfficerId }) => {
      console.log(`🔄 Task creation process completed for area officer: ${areaOfficerId}`, {
        success: !!data,
        error: error?.message,
      });
    },
  });
};

// Validation functions
export const validateTaskFormData = (formData: TaskFormData): string[] => {
  const errors: string[] = [];

  // Validate task location
  if (formData.taskLocation.isCustomLocation) {
    if (!formData.taskLocation.customLocation?.trim()) {
      errors.push("Custom location is required");
    }
  } else {
    if (formData.taskLocation.selectedSites.length === 0) {
      errors.push("Please select at least one site");
    }
  }

  // Validate task selection
  if (formData.taskSelection.selectedTasks.length === 0) {
    errors.push("Please select at least one task type");
  }

  // Validate deadline
  if (!formData.taskDeadline.dueDate) {
    errors.push("Due date is required");
  }

  if (!formData.taskDeadline.dueTime) {
    errors.push("Due time is required");
  }

  if (!formData.taskDeadline.amPm) {
    errors.push("Please select AM/PM");
  }

  // Validate time format
  if (formData.taskDeadline.dueTime) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.taskDeadline.dueTime)) {
      errors.push("Invalid time format. Please use HH:MM format");
    }
  }

  // Validate date is not in the past
  if (formData.taskDeadline.dueDate && formData.taskDeadline.dueTime && formData.taskDeadline.amPm) {
    try {
      const deadline = formatDeadlineToISO(
        formData.taskDeadline.dueDate,
        formData.taskDeadline.dueTime,
        formData.taskDeadline.amPm
      );
      const deadlineDate = new Date(deadline);
      const now = new Date();

      if (deadlineDate < now) {
        errors.push("Task deadline cannot be in the past");
      }
    } catch (error) {
      errors.push("Invalid deadline format");
    }
  }

  return errors;
};

// Utility functions
export const useTaskCreationUtils = () => {
  const queryClient = useQueryClient();

  const invalidateTaskQueries = (areaOfficerId: string) => {
    queryClient.invalidateQueries({
      queryKey: ["siteTasks", "areaOfficer", areaOfficerId],
    });
  };

  const getTaskTypeDisplayName = (taskType: string): string => {
    const displayNames: Record<string, string> = {
      site_visit: "Site Visit",
      inspection: "Inspection",
      document: "Document",
      training: "Training",
      other: "Other",
    };

    return displayNames[taskType] || taskType;
  };

  const formatDeadlineForDisplay = (dueDate: string, dueTime: string, amPm: "AM" | "PM"): string => {
    try {
      const isoString = formatDeadlineToISO(dueDate, dueTime, amPm);
      const date = new Date(isoString);

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return `${dueDate} ${dueTime} ${amPm}`;
    }
  };

  return {
    invalidateTaskQueries,
    getTaskTypeDisplayName,
    formatDeadlineForDisplay,
    validateTaskFormData,
  };
};
