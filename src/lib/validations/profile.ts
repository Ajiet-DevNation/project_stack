import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  section: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
  college: z.string().optional(),
  bio: z.string().max(300, "Bio cannot exceed 300 characters").optional(),
  image: z.string().url("Invalid URL for image").optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;