import { useEffect, useState } from "react";
import { type Client, type CreateTaskRequest, taskService } from "../service/taskService";

export interface TaskFormData {
  taskLocation: {
    selectedClients: number[];
    customLocation?: string;
  };
  taskSelection: {
    selectedTasks: string[];
  };
  taskDeadline: {
    dueDate: string;
    dueTime: string;
    amPm: "AM" | "PM";
  };
}

export const useTaskForm = () => {
  const [formData, setFormData] = useState<TaskFormData>({
    taskLocation: { selectedClients: [] },
    taskSelection: { selectedTasks: [] },
    taskDeadline: { dueDate: "", dueTime: "", amPm: "AM" },
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load clients on mount
  useEffect(() => {
    loadClients();
    loadDraft();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const clientsData = await taskService.getClients();
      setClients(clientsData);
    } catch (err) {
      setError("Failed to load clients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem("taskDraft");
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
      } catch (err) {
        console.error("Error loading draft:", err);
      }
    }
  };

  const updateFormData = (section: keyof TaskFormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const saveDraft = async () => {
    try {
      localStorage.setItem("taskDraft", JSON.stringify(formData));
      await taskService.saveDraft({
        clientIds: formData.taskLocation.selectedClients,
        taskTypes: formData.taskSelection.selectedTasks,
        dueDate: formData.taskDeadline.dueDate,
        dueTime: `${formData.taskDeadline.dueTime} ${formData.taskDeadline.amPm}`,
        customLocation: formData.taskLocation.customLocation,
      });
      return true;
    } catch (err) {
      console.error("Error saving draft:", err);
      return false;
    }
  };

  const submitTask = async () => {
    try {
      setLoading(true);
      setError(null);

      const taskData: CreateTaskRequest = {
        clientIds: formData.taskLocation.selectedClients,
        taskTypes: formData.taskSelection.selectedTasks,
        dueDate: formData.taskDeadline.dueDate,
        dueTime: `${formData.taskDeadline.dueTime} ${formData.taskDeadline.amPm}`,
        customLocation: formData.taskLocation.customLocation,
      };

      const result = await taskService.createTask(taskData);

      // Clear draft after successful creation
      localStorage.removeItem("taskDraft");

      return result;
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.taskLocation.selectedClients.length > 0;
      case 2:
        return formData.taskSelection.selectedTasks.length > 0;
      case 3:
        return formData.taskDeadline.dueDate && formData.taskDeadline.dueTime && formData.taskDeadline.amPm;
      default:
        return true;
    }
  };

  const clearForm = () => {
    setFormData({
      taskLocation: { selectedClients: [] },
      taskSelection: { selectedTasks: [] },
      taskDeadline: { dueDate: "", dueTime: "", amPm: "AM" },
    });
    localStorage.removeItem("taskDraft");
  };

  return {
    formData,
    clients,
    loading,
    error,
    updateFormData,
    saveDraft,
    submitTask,
    validateStep,
    clearForm,
    loadClients,
  };
};
