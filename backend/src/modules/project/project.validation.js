import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, { message: "Project name is required" }),
    repoUrl: z.string().url({ message: "Must be a valid URL" }).includes('github.com', { message: "Must be a GitHub repository URL" }),
  }),
});
