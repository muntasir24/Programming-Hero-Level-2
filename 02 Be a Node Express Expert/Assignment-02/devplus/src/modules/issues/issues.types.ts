export interface CreateIssueBody {
  title: string;
  description: string;
  type: "bug" | "feature_request";
}
export interface UpdateIssueBody {
  title?: string;
  description?: string;
  type?: "bug" | "feature_request";
}

export interface ReporterInfo {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
}

// issue with reporter nested (used in GET responses)
export interface IssueWithReporter {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter: ReporterInfo;
  created_at: Date;
  updated_at: Date;
}
