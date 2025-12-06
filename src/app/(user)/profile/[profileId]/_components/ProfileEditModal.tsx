"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { profileSchema, ProfileFormData } from "@/lib/validations/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { X, Save, ChevronsUpDown, Info, Check } from "lucide-react";
import axios from "axios";
import { Profile } from "@/types/profile";
import { engineeringColleges } from "@/lib/college";
import { PREDEFINED_SKILLS } from "@/lib/skills";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/imageUpload";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onSave: (data: Partial<Profile>) => void;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: ProfileEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollegeComboboxOpen, setIsCollegeComboboxOpen] = useState(false);
  const submitLockRef = useRef(false);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        section: profile.section || "",
        branch: profile.branch || "",
        year: profile.year || "",
        college: profile.college || "",
        bio: profile.bio || "",
        image: profile.image || "",
        skills: profile.skills || [],
      });
    }
  }, [profile, reset]);

  const skills = watch("skills") || [];

  const displayImage = session?.user?.image || watch("image") || undefined;

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue(
      "skills",
      skills.filter((skill) => skill !== skillToRemove),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitting(true);

    try {
      const submitData = { ...data };
      if (!submitData.image) {
        delete submitData.image;
      }

      const response = await axios.put(`/api/profile/me`, submitData);

      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      if (
        axios.isAxiosError(error) &&
        error.response &&
        Array.isArray(error.response.data)
      ) {
        error.response.data.forEach((err: { message: string }) => {
          console.error("Validation error:", err.message);
        });
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        submitLockRef.current = false;
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "bg-card border-0 shadow-2xl",
          "w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-[85vw] lg:w-[75vw] xl:w-[65vw] max-w-3xl",
          "h-[calc(100vh-1rem)] sm:h-auto max-h-[calc(100vh-1rem)] sm:max-h-[92vh]",
          "overflow-hidden flex flex-col",
          "p-4 sm:p-5 md:p-6 lg:p-7",
          "rounded-lg sm:rounded-xl"
        )}
      >
        <DialogHeader className="pb-3 sm:pb-4 md:pb-5 flex-shrink-0">
          <DialogTitle className="text-foreground text-lg sm:text-xl md:text-2xl font-semibold">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 -mx-4 sm:-mx-5 md:-mx-6 lg:-mx-7 px-4 sm:px-5 md:px-6 lg:px-7">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4 md:space-y-5 pb-2"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-primary/20">
                  <AvatarImage src={displayImage} alt={watch("name")} />
                  <AvatarFallback className="text-base sm:text-lg bg-primary/10">
                    {watch("name")
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {/* <Label htmlFor="image" className="text-foreground text-sm sm:text-base">
                                        Custom Profile Image URL (Optional)
                                    </Label>
                                    <Input
                                        id="image"
                                        placeholder="https://example.com/image.jpg"
                                        {...register("image")}
                                        className={cn(
                                            "mt-1 bg-background/40 backdrop-blur-sm border-border/40",
                                            "text-sm sm:text-base h-9 sm:h-10",
                                            errors.image && "border-destructive"
                                        )}
                                    />
                                    {errors.image && (
                                        <p className="text-xs text-destructive mt-1">{errors.image.message}</p>
                                    )} */}
                  <div className="space-y-1.5 sm:space-y-2 animate-in slide-in-from-left-2 duration-500 delay-[450ms]">
                    <ImageUpload
                      label="Profile Image"
                      value={watch("image") || ""}
                      onChange={(url) => {
                        setValue("image", url, { shouldValidate: true });
                      }}
                    />
                    {errors.image && (
                      <p className="text-xs sm:text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                        {errors.image.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {session?.user?.image && (
                <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
                  <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Your OAuth provider image is being used. Add a custom URL
                    above to override it.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="name"
                  className="text-foreground text-sm sm:text-base"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={cn(
                    "bg-background/40 backdrop-blur-sm border-border/40",
                    "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                    errors.name && "border-destructive"
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="section"
                  className="text-foreground text-sm sm:text-base"
                >
                  Section
                </Label>
                <Input
                  id="section"
                  placeholder="A, B, C..."
                  {...register("section")}
                  className={cn(
                    "bg-background/40 backdrop-blur-sm border-border/40",
                    "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                    errors.section && "border-destructive"
                  )}
                />
                {errors.section && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.section.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="branch"
                  className="text-foreground text-sm sm:text-base"
                >
                  Branch
                </Label>
                <Input
                  id="branch"
                  placeholder="Computer Science Engineering"
                  {...register("branch")}
                  className={cn(
                    "bg-background/40 backdrop-blur-sm border-border/40",
                    "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                    errors.branch && "border-destructive"
                  )}
                />
                {errors.branch && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.branch.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="year"
                  className="text-foreground text-sm sm:text-base"
                >
                  Year
                </Label>
                <Input
                  id="year"
                  placeholder="1st Year, 2nd Year..."
                  {...register("year")}
                  className={cn(
                    "bg-background/40 backdrop-blur-sm border-border/40",
                    "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                    errors.year && "border-destructive"
                  )}
                />
                {errors.year && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.year.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="college"
                  className="text-foreground text-sm sm:text-base"
                >
                  College
                </Label>
                <Popover
                  open={isCollegeComboboxOpen}
                  onOpenChange={setIsCollegeComboboxOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isCollegeComboboxOpen}
                      className={cn(
                        "w-full justify-between bg-background/40 backdrop-blur-sm border-border/40",
                        "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                        errors.college && "border-destructive"
                      )}
                    >
                      <span className="truncate">
                        {watch("college") || "Select your college"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search college..." />
                      <CommandEmpty>No college found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {engineeringColleges.map((collegeOption) => (
                            <CommandItem
                              key={collegeOption}
                              onSelect={() => {
                                setValue("college", collegeOption, {
                                  shouldValidate: true,
                                });
                                setIsCollegeComboboxOpen(false);
                              }}
                            >
                              {collegeOption}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.college && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.college.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="bio"
                className="text-foreground text-sm sm:text-base"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself, your interests, and what you're looking for..."
                rows={4}
                {...register("bio")}
                className={cn(
                  "bg-background/40 backdrop-blur-sm border-border/40 resize-none",
                  "text-sm sm:text-base",
                  errors.bio && "border-destructive"
                )}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio && (
                  <p className="text-xs text-destructive">
                    {errors.bio.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {watch("bio")?.length || 0}/300
                </p>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-foreground text-sm sm:text-base">
                Skills
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between bg-background/40 backdrop-blur-sm border-border/40 cursor-pointer",
                      "text-sm sm:text-base h-9 sm:h-10 md:h-11",
                      errors.skills && "border-destructive"
                    )}
                  >
                    <span className="truncate">
                      {skills.length === 0
                        ? "Select your skills"
                        : `${skills.length} skill(s) selected`}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search skills..."
                      className="h-9"
                    />
                    <CommandEmpty>No skills found.</CommandEmpty>

                    <CommandList className="max-h-[300px] overflow-y-auto">
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
                                      setValue("skills", [...skills, skill], {
                                        shouldValidate: true,
                                      });
                                    }
                                  }}
                                  className="cursor-pointer"
                                >
                                  <div
                                    className={cn(
                                      "mr-2 h-4 w-4 rounded-sm border flex items-center justify-center",
                                      selected
                                        ? "bg-primary border-primary"
                                        : "border-muted"
                                    )}
                                  >
                                    {selected && (
                                      <Check className="h-3 w-3 text-primary-foreground" />
                                    )}
                                  </div>
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

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-primary/20 text-foreground border border-border/20 backdrop-blur-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-destructive transition-colors hover:bg-black/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {errors.skills && (
                <p className="text-xs text-destructive">
                  {errors.skills.message}
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-5 border-t border-border/20 flex-shrink-0 mt-4 sm:mt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className={cn(
              "bg-background/20 border-border/30 w-full sm:w-auto order-2 sm:order-1 cursor-pointer",
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
              "bg-primary/80 hover:bg-primary/90 backdrop-blur-sm w-full sm:w-auto order-1 sm:order-2 cursor-pointer",
              "h-9 sm:h-10 md:h-11 text-sm sm:text-base"
            )}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
