"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { User, GraduationCap, Building2, Calendar, MapPin, FileText, Sparkles, X, Play, ChevronsUpDown } from "lucide-react"
import axios from "axios";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandList, CommandGroup, CommandItem, CommandInput, CommandEmpty } from "@/components/ui/command"
import { PREDEFINED_SKILLS } from "@/lib/skills"
import { engineeringColleges } from "@/lib/college"

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  section: z.string().min(1, "Please enter your section"),
  branch: z.string().min(2, "Please enter your branch"),
  year: z.string().min(1, "Please enter your year"),
  college: z.string().refine(
    (val) => engineeringColleges.includes(val),
    { message: "Please select a valid college from the list." }
  ),
  bio: z.string().min(10, "Tell us a bit more (min 10 chars)").max(300, "Max 300 characters"),
  skills: z.array(z.string().min(1)).min(1, "Add at least one skill"),
})

type FormValues = z.infer<typeof schema>

const formSteps = [
  { id: 'personal', title: 'Personal Info', fields: ['name', 'section'] },
  { id: 'academic', title: 'Academic Details', fields: ['branch', 'year', 'college'] },
  { id: 'profile', title: 'Profile & Skills', fields: ['bio', 'skills'] }
]

const fieldIcons = {
  name: User,
  section: GraduationCap,
  branch: Building2,
  year: Calendar,
  college: MapPin,
  bio: FileText,
  skills: Sparkles
}

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = React.useState(-1) // Start at -1 for welcome screen
  const [completedFields, setCompletedFields] = React.useState<Set<string>>(new Set())
  const [isCollegeComboboxOpen, setIsCollegeComboboxOpen] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      section: "",
      branch: "",
      year: "",
      college: "",
      bio: "",
      skills: [],
    },
  })

  // Watch individual fields to avoid infinite loop
  const name = watch("name")
  const section = watch("section")
  const branch = watch("branch")
  const year = watch("year")
  const college = watch("college")
  const bio = watch("bio")
  const skills = watch("skills")

  // Track completed fields with individual dependencies
  React.useEffect(() => {
    const newCompleted = new Set<string>()
    
    if (name && name.trim().length > 0) newCompleted.add('name')
    if (section && section.trim().length > 0) newCompleted.add('section')
    if (branch && branch.trim().length > 0) newCompleted.add('branch')
    if (year && year.trim().length > 0) newCompleted.add('year')
    if (college && college.trim().length > 0) newCompleted.add('college')
    if (bio && bio.trim().length > 0) newCompleted.add('bio')
    if (skills && skills.length > 0) newCompleted.add('skills')
    
    setCompletedFields(newCompleted)
  }, [name, section, branch, year, college, bio, skills])

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setValue("skills", updatedSkills, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("[v0] Onboarding submit:", data);
      const updatedData = await axios.post("/api/profile", data);
      console.log(updatedData);
      
      // Force a hard reload to update the session and redirect to home
      // We use window.location.href instead of router.push to ensure 
      // the session is re-fetched from the server
      window.location.href = "/home";
    } catch (error) {
      console.error("Error submitting onboarding form:", error);
      // You might want to show an error message to the user here
    }
  }

  const startOnboarding = () => {
    setCurrentStep(0)
  }

  const nextStep = async () => {
    const currentFields = formSteps[currentStep].fields as (keyof FormValues)[];
    const isValid = await trigger(currentFields);
    if (isValid && currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetForm = () => {
    reset()
    setCurrentStep(-1)
    setCompletedFields(new Set())
  }

  // Welcome Screen
  if (currentStep === -1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center"
        >
          <User className="w-8 h-8 text-primary" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Welcome to ProjectStack!</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Let&apos;s set up your profile in just 3 simple steps. This will help us match you with the perfect projects and collaborators.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Personal Info
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Academic Details
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Skills & Bio
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={startOnboarding}
            size="lg"
            className="bg-primary/80 text-primary-foreground hover:bg-primary/90 backdrop-blur-sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Setup
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  const renderField = (fieldName: keyof FormValues, placeholder: string, type: 'input' | 'textarea' = 'input') => {
    const Icon = fieldIcons[fieldName]
    const isCompleted = completedFields.has(fieldName)
    const hasError = errors[fieldName]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <Label 
          htmlFor={fieldName} 
          className="text-foreground font-medium flex items-center gap-2"
        >
          <Icon className="w-4 h-4" />
          {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
          )}
        </Label>
        
        <div className="relative">
          {type === 'input' ? (
            <Input
              id={fieldName}
              placeholder={placeholder}
              {...register(fieldName)}
              className={cn(
                "bg-background/40 backdrop-blur-sm border-border/40 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:bg-background/60 focus:border-primary/50",
                hasError && "border-destructive/50 focus:border-destructive",
                isCompleted && "border-green-500/30"
              )}
            />
          ) : (
            <Textarea
              id={fieldName}
              placeholder={placeholder}
              rows={4}
              {...register(fieldName)}
              className={cn(
                "bg-background/40 backdrop-blur-sm border-border/40 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:bg-background/60 focus:border-primary/50 resize-none",
                hasError && "border-destructive/50 focus:border-destructive",
                isCompleted && "border-green-500/30"
              )}
            />
          )}
          
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {hasError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive"
            >
              {hasError.message?.toString()}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  const renderSkillsField = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <Label htmlFor="skills" className="text-foreground font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Skills
        {skills.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
        )}
      </Label>
      
      <div className="space-y-3">
      <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {skills.length === 0
                      ? "Select your skills"
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
                                        "skills",
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

        <AnimatePresence>
          {skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {skills.map((skill: string, index: number) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-foreground border border-border/20 backdrop-blur-sm hover:bg-primary/30 transition-colors group"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {errors.skills && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive"
            >
              {errors.skills.message?.toString()}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )

  const renderCollegeField = () => {
    const Icon = fieldIcons['college']
    const isCompleted = completedFields.has('college')
    const hasError = errors['college']
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <Label 
          htmlFor="college" 
          className="text-foreground font-medium flex items-center gap-2"
        >
          <Icon className="w-4 h-4" />
          College
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
          )}
        </Label>
        
        <Popover open={isCollegeComboboxOpen} onOpenChange={setIsCollegeComboboxOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isCollegeComboboxOpen}
              className={cn(
                "w-full justify-between bg-background/40 backdrop-blur-sm border-border/40 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:bg-background/60 focus:border-primary/50",
                hasError && "border-destructive/50 focus:border-destructive",
                isCompleted && "border-green-500/30"
              )}
            >
              <span className="truncate">{college || "Select your college"}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search college..." />
              <CommandEmpty>No college found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {engineeringColleges.map((collegeOption) => (
                    <CommandItem
                      key={collegeOption}
                      onSelect={() => {
                        setValue("college", collegeOption, { shouldValidate: true });
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

        <AnimatePresence>
          {hasError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive"
            >
              {hasError.message?.toString()}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {formSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <motion.div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/40 text-muted-foreground border border-border/40"
              )}
              animate={{
                scale: index === currentStep ? 1.1 : 1,
              }}
            >
              {index + 1}
            </motion.div>
            <span className="ml-2 text-sm font-medium text-foreground hidden sm:block">
              {step.title}
            </span>
            {index < formSteps.length - 1 && (
              <div className="w-8 sm:w-16 h-px bg-border/40 mx-4" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Step 0: Personal Info */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('name', 'e.g., Aanya Sharma')}
                {renderField('section', 'e.g., A / B / C')}
              </div>
            )}

            {/* Step 1: Academic Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField('branch', 'e.g., CSE / ECE / ME / CE')}
                  {renderField('year', 'e.g., 1st / 2nd / 3rd / 4th')}
                </div>
                {renderCollegeField()}
              </div>
            )}

            {/* Step 2: Profile & Skills */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {renderField('bio', 'Briefly describe your interests and project experience...', 'textarea')}
                {renderSkillsField()}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-border/30 text-foreground bg-background/20 backdrop-blur-sm hover:bg-background/30 disabled:opacity-50"
          >
            Previous
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting}
              className="border-border/30 text-foreground bg-background/20 backdrop-blur-sm hover:bg-background/30"
            >
              Start Over
            </Button>

            {currentStep < formSteps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-primary/80 text-primary-foreground hover:bg-primary/90 backdrop-blur-sm"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary/80 text-primary-foreground hover:bg-primary/90 backdrop-blur-sm"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  "Complete Profile"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}