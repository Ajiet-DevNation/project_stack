"use client";

import * as React from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PREDEFINED_SKILLS } from "@/lib/skills";
import { ImageUpload } from "./ui/imageUpload";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
} from "@/components/ui/command";

import { ChevronsUpDown } from "lucide-react";

import { projectSchema } from "@/lib/validations/project";

type ProjectFormData = {
  title: string;
  description: string;
  requiredSkills: string[];
  startDate: Date;
  endDate: Date;
  projectStatus: string;
  githubLink?: string;
  liveUrl?: string;
  thumbnail?: string;
};

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as Resolver<ProjectFormData>,
    defaultValues: {
      title: "",
      description: "",
      requiredSkills: [],
      startDate: undefined,
      endDate: undefined,
      githubLink: "",
      liveUrl: "",
      thumbnail: "",
      projectStatus: "Planning",
    },
  });

  const skills = watch("requiredSkills");

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setValue("requiredSkills", updatedSkills, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create project");
      }

      toast.success("Project created successfully!");
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      console.error("Project creation error:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className={cn(
          "bg-card border-0 shadow-2xl",
          "w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-[85vw] lg:w-[75vw] xl:w-[65vw] max-w-3xl",
          "h-[calc(100vh-1rem)] sm:h-auto max-h-[calc(100vh-1rem)] sm:max-h-[92vh]",
          "overflow-hidden flex flex-col",
          "p-4 sm:p-5 md:p-6 lg:p-7",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300",
          "rounded-lg sm:rounded-xl"
        )}
      >
        <DialogHeader className="animate-in slide-in-from-top-2 duration-500 pb-3 sm:pb-4 md:pb-5 flex-shrink-0">
          <DialogTitle className="text-foreground text-lg sm:text-xl md:text-2xl font-semibold">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 -mx-4 sm:-mx-5 md:-mx-6 lg:-mx-7 px-4 sm:px-5 md:px-6 lg:px-7">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4 md:space-y-5 pb-2"
          >
            {/* Title */}
            <div className="space-y-1.5 sm:space-y-2 animate-in slide-in-from-left-2 duration-500 delay-75">
              <Label
                htmlFor="title"
                className="text-foreground text-sm sm:text-base font-medium"
              >
                Project Title *
              </Label>
              <Input
                id="title"
                {...register("title")}
                className={cn(
                  "border-border bg-background/50 transition-all duration-200",
                  "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                  "px-3 sm:px-4",
                  "focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  errors.title && "border-destructive animate-shake"
                )}
              />
              {errors.title && (
                <p className="text-xs sm:text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2 animate-in slide-in-from-left-2 duration-500 delay-100">
              <Label
                htmlFor="description"
                className="text-foreground text-sm sm:text-base font-medium"
              >
                Description *
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                className={cn(
                  "border-border bg-background/50 min-h-[70px] sm:min-h-[85px] md:min-h-[100px]",
                  "transition-all duration-200",
                  "text-sm sm:text-base resize-none",
                  "px-3 sm:px-4 py-2 sm:py-2.5 md:py-3",
                  "focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  errors.description && "border-destructive animate-shake"
                )}
              />
              {errors.description && (
                <p className="text-xs sm:text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Required Skills */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base font-medium">
                Required Skills *
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {skills.length === 0
                      ? "Select required skills"
                      : `${skills.length} skill(s) selected`}
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search skills..." />
                    <CommandEmpty>No skills found.</CommandEmpty>

                    <CommandList>
                      {Object.entries(PREDEFINED_SKILLS).map(
                        ([category, items]) => (
                          <CommandGroup key={category} heading={category}>
                            {items.map((skill) => {
                              const selected = skills.includes(skill);

                              return (
                                <CommandItem
                                  key={skill}
                                  onSelect={() => {
                                    if (selected) {
                                      handleRemoveSkill(skill);
                                    } else {
                                      setValue(
                                        "requiredSkills",
                                        [...skills, skill],
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                    }
                                  }}
                                >
                                  <div
                                    className={`mr-2 h-4 w-4 rounded-sm border ${
                                      selected
                                        ? "bg-primary border-primary"
                                        : "border-muted"
                                    }`}
                                  />
                                  {skill}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        )
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selected Skill Badges */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-primary flex gap-1 items-center"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:bg-black/20 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-in slide-in-from-left-2 duration-500 delay-200">
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-foreground text-sm sm:text-base font-medium"
                >
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate", { valueAsDate: true })}
                  className={cn(
                    "border-border bg-background/50 transition-all duration-200",
                    "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                    "px-3 sm:px-4",
                    "focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    errors.startDate && "border-destructive animate-shake"
                  )}
                />
                {errors.startDate && (
                  <p className="text-xs sm:text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-foreground text-sm sm:text-base font-medium"
                >
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate", { valueAsDate: true })}
                  className={cn(
                    "border-border bg-background/50 transition-all duration-200",
                    "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                    "px-3 sm:px-4",
                    "focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    errors.endDate && "border-destructive animate-shake"
                  )}
                />
                {errors.endDate && (
                  <p className="text-xs sm:text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5 sm:space-y-2 animate-in slide-in-from-left-2 duration-500 delay-300">
              <Label
                htmlFor="projectStatus"
                className="text-foreground text-sm sm:text-base font-medium"
              >
                Project Status *
              </Label>
              <select
                id="projectStatus"
                {...register("projectStatus")}
                className={cn(
                  "flex h-9 sm:h-10 md:h-11 w-full rounded-md border border-input bg-background/50",
                  "px-3 sm:px-4 py-2 text-sm sm:text-base ring-offset-background",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  "transition-all duration-200",
                  errors.projectStatus && "border-destructive animate-shake"
                )}
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.projectStatus && (
                <p className="text-xs sm:text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                  {errors.projectStatus.message}
                </p>
              )}
            </div>

            {/* GitHub Link */}
            <div className="space-y-1.5 sm:space-y-2 animate-in slide-in-from-left-2 duration-500 delay-[350ms]">
              <Label
                htmlFor="githubLink"
                className="text-foreground text-sm sm:text-base font-medium"
              >
                GitHub Link
              </Label>
              <Input
                id="githubLink"
                {...register("githubLink")}
                placeholder="https://github.com/username/repo"
                className={cn(
                  "border-border bg-background/50 transition-all duration-200",
                  "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                  "px-3 sm:px-4",
                  "focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  errors.githubLink && "border-destructive animate-shake"
                )}
              />
              {errors.githubLink && (
                <p className="text-xs sm:text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                  {errors.githubLink.message}
                </p>
              )}
            </div>

            {/* Live URL */}
            <div className="space-y-1.5 sm:space-y-2 animate-in slide-in-from-left-2 duration-500 delay-[400ms]">
              <Label
                htmlFor="liveUrl"
                className="text-foreground text-sm sm:text-base font-medium"
              >
                Live URL
              </Label>
              <Input
                id="liveUrl"
                {...register("liveUrl")}
                placeholder="https://example.com"
                className={cn(
                  "border-border bg-background/50 transition-all duration-200",
                  "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                  "px-3 sm:px-4",
                  "focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  errors.liveUrl && "border-destructive animate-shake"
                )}
              />
              {errors.liveUrl && (
                <p className="text-xs sm:text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                  {errors.liveUrl.message}
                </p>
              )}
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-1.5 sm:space-y-2 animate-in slide-in-from-left-2 duration-500 delay-[450ms]">
              <ImageUpload 
                label="Project Thumbnail"
                value={watch("thumbnail") || ""} 
                onChange={(url) => {
                  setValue("thumbnail", url, { shouldValidate: true });
                }}
                aspect={16 / 9}
              />
              {errors.thumbnail && (
                <p className="text-xs sm:text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>
          </form>
        </div>

        <DialogFooter className="mt-4 sm:mt-5 animate-in slide-in-from-bottom-2 duration-500 delay-500 flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0 pt-4 sm:pt-5 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className={cn(
              "transition-all duration-200 hover:scale-105 active:scale-95",
              "w-full sm:w-auto order-2 sm:order-1",
              "h-9 sm:h-10 md:h-11 text-sm sm:text-base"
            )}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className={cn(
              "transition-all duration-200 hover:scale-105 active:scale-95",
              "w-full sm:w-auto order-1 sm:order-2 sm:ml-0",
              "h-9 sm:h-10 md:h-11 text-sm sm:text-base"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
