export interface SignupBody {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
  created_at: Date;
  updated_at: Date;
}
