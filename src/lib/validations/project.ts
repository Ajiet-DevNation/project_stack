import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  requiredSkills: z.array(z.string()).nonempty(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  githubLink: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  thumbnail: z.string().url().optional().or(z.literal("")),
  projectStatus: z.string().min(1),
});

export type ProjectFormData = z.infer<typeof projectSchema>;