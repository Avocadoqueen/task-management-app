import { render, screen } from "@testing-library/react";
import { TaskCard } from "@/frontend/components/student/task-card";
import type { Task } from "@/frontend/lib/tasks";

const baseTask: Task = {
  id: "task-1",
  title: "Test Task",
  description: "Complete the test assignment",
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  status: "pending",
  priority: "medium",
  course: "CS101",
  assignedBy: "Dr. Test",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("TaskCard", () => {
  it("renders task details and submit button", () => {
    render(<TaskCard task={baseTask} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("shows submission link when provided", () => {
    render(<TaskCard task={{ ...baseTask, submissionUrl: "https://example.com/submission" }} />);
    expect(screen.getByText("Submission attached")).toBeInTheDocument();
    expect(screen.getByText("View")).toHaveAttribute("href", "https://example.com/submission");
  });
});
