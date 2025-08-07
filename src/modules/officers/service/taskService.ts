// Interface definitions for API
export interface CreateTaskRequest {
  clientIds: number[];
  taskTypes: string[];
  dueDate: string;
  dueTime: string;
  customLocation?: string;
  status?: "pending" | "in_progress" | "completed";
}

export interface CreateTaskResponse {
  id: number;
  clientIds: number[];
  taskTypes: string[];
  dueDate: string;
  dueTime: string;
  customLocation?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDraftRequest {
  clientIds: number[];
  taskTypes: string[];
  dueDate?: string;
  dueTime?: string;
  customLocation?: string;
}

export interface Client {
  id: number;
  name: string;
  companyId: string;
  logo?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
}

// API endpoints configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// API service class
class TaskService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/tasks`;
  }

  // Fetch all clients for task location selection
  async getClients(): Promise<Client[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  }

  // Create a new task
  async createTask(taskData: CreateTaskRequest): Promise<CreateTaskResponse> {
    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          ...taskData,
          createdAt: new Date().toISOString(),
          status: taskData.status || "pending",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  // Save task as draft
  async saveDraft(draftData: TaskDraftRequest): Promise<{ id: number; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          ...draftData,
          savedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error;
    }
  }

  // Get saved drafts
  async getDrafts(): Promise<TaskDraftRequest[]> {
    try {
      const response = await fetch(`${this.baseURL}/drafts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching drafts:", error);
      throw error;
    }
  }

  // Delete a draft
  async deleteDraft(draftId: number): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/draft/${draftId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting draft:", error);
      throw error;
    }
  }

  // Get task types/categories
  async getTaskTypes(): Promise<{ id: string; name: string; icon: string }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/task-types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching task types:", error);
      throw error;
    }
  }

  // Add new location/client
  async addNewLocation(locationData: {
    name: string;
    address: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  }): Promise<Client> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding new location:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const taskService = new TaskService();
