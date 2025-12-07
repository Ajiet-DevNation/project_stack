import { z } from "zod";

export const projectSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    requiredSkills: z.array(z.string()).nonempty("Please select at least one skill"),
    startDate: z.coerce.date({
      message: "Please select a valid start date",
    }),
    endDate: z.preprocess((arg) => {
      if (!arg) return undefined;
      return arg;
    }, z.coerce.date().optional()),
    githubLink: z.string().url().optional().or(z.literal("")),
    liveUrl: z.string().url().optional().or(z.literal("")),
    thumbnail: z.string().url().optional().or(z.literal("")),
    projectStatus: z.string().min(1),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  );

export type ProjectFormData = z.infer<typeof projectSchema>;