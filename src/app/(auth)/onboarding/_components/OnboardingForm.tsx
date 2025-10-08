"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  section: z.string().min(1, "Please enter your section"),
  branch: z.string().min(2, "Please enter your branch"),
  year: z.string().min(1, "Please enter your year"),
  college: z.string().min(2, "Please enter your college"),
  bio: z.string().min(10, "Tell us a bit more (min 10 chars)").max(300, "Max 300 characters"),
  skills: z.array(z.string().min(1)).min(1, "Add at least one skill"),
})

type FormValues = z.infer<typeof schema>

export function OnboardingForm() {
  const [skillInput, setSkillInput] = React.useState("")
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
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

  const skills = watch("skills")

  const addSkill = React.useCallback(
    (raw: string) => {
      const value = raw.trim().replace(/[,]+$/, "")
      if (!value) return
      if (skills.includes(value)) return
      const next = [...skills, value]
      setValue("skills", next, { shouldValidate: true })
      setSkillInput("")
    },
    [skills, setValue],
  )

  const removeSkill = (value: string) => {
    const next = skills.filter((s: string) => s !== value)
    setValue("skills", next, { shouldValidate: true })
  }

  const onSubmit = async (data: FormValues) => {
    console.log("[v0] Onboarding submit:", data)
    reset()
  }

  const onSkillKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="md:col-span-1">
        <Label htmlFor="name" style={{ color: '#0e120e' }}>
          Name
        </Label>
        <Input
          id="name"
          placeholder="e.g., Aanya Sharma"
          autoComplete="name"
          {...register("name")}
          aria-invalid={!!errors.name}
          className="mt-2"
          style={{
            backgroundColor: '#bfd8af',
            borderColor: '#bfd8af',
            color: '#0e120e'
          }}
        />
        {errors.name && (
          <p role="alert" className="mt-2 text-xs" style={{ color: '#dc2626' }}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="md:col-span-1">
        <Label htmlFor="section" style={{ color: '#0e120e' }}>
          Section
        </Label>
        <Input
          id="section"
          placeholder="e.g., A / B / C"
          {...register("section")}
          aria-invalid={!!errors.section}
          className="mt-2"
          style={{
            backgroundColor: '#bfd8af',
            borderColor: '#bfd8af',
            color: '#0e120e'
          }}
        />
        {errors.section && (
          <p role="alert" className="mt-2 text-xs" style={{ color: '#dc2626' }}>
            {errors.section.message}
          </p>
        )}
      </div>

      <div className="md:col-span-1">
        <Label htmlFor="branch" style={{ color: '#0e120e' }}>
          Branch
        </Label>
        <Input
          id="branch"
          placeholder="e.g., CSE / ECE / ME / CE"
          {...register("branch")}
          aria-invalid={!!errors.branch}
          className="mt-2"
          style={{
            backgroundColor: '#bfd8af',
            borderColor: '#bfd8af',
            color: '#0e120e'
          }}
        />
        {errors.branch && (
          <p role="alert" className="mt-2 text-xs" style={{ color: '#dc2626' }}>
            {errors.branch.message}
          </p>
        )}
      </div>

      <div className="md:col-span-1">
        <Label htmlFor="year" style={{ color: '#0e120e' }}>
          Year
        </Label>
        <Input
          id="year"
          placeholder="e.g., 1st / 2nd / 3rd / 4th"
          {...register("year")}
          aria-invalid={!!errors.year}
          className="mt-2"
          style={{
            backgroundColor: '#bfd8af',
            borderColor: '#bfd8af',
            color: '#0e120e'
          }}
        />
        {errors.year && (
          <p role="alert" className="mt-2 text-xs" style={{ color: '#dc2626' }}>
            {errors.year.message}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="college" style={{ color: '#0e120e' }}>
          College
        </Label>
        <Input
          id="college"
          placeholder="e.g., National Institute of Technology"
          autoComplete="organization"
          {...register("college")}
          aria-invalid={!!errors.college}
          className="mt-2"
          style={{
            backgroundColor: '#bfd8af',
            borderColor: '#bfd8af',
            color: '#0e120e'
          }}
        />
        {errors.college && (
          <p role="alert" className="mt-2 text-xs" style={{ color: '#dc2626' }}>
            {errors.college.message}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="bio" style={{ color: '#0e120e' }}>
          Bio
        </Label>
        <Textarea
          id="bio"
          placeholder="Briefly describe your interests and project experience (max 300 chars)"
          rows={5}
          {...register("bio")}
          aria-invalid={!!errors.bio}
          className="mt-2"
          style={{
            backgroundColor: '#bfd8af',
            borderColor: '#bfd8af',
            color: '#0e120e'
          }}
        />
        <p className="mt-2 text-xs" style={{ color: '#0e120e' }}>
          Tip: mention domains (AI, Web, IoT), tools, and what youre looking for.
        </p>
        {errors.bio && (
          <p role="alert" className="mt-2 text-xs" style={{ color: '#dc2626' }}>
            {errors.bio.message}
          </p>
        )}
      </div>

      <Controller
        control={control}
        name="skills"
        render={() => (
          <div className="md:col-span-2">
            <Label htmlFor="skills" style={{ color: '#0e120e' }}>
              Skills
            </Label>
            <div
              className={cn(
                "mt-2 flex min-h-11 flex-wrap items-center gap-2 rounded-md border px-3 py-2",
              )}
              style={{
                backgroundColor: '#e1f0da',
                borderColor: '#bfd8af'
              }}
            >
              {skills.length === 0 && (
                <span className="text-xs" style={{ color: '#0e120e' }}>
                  Add skills and press Enter (e.g., React, Python, Figma)
                </span>
              )}
              {skills.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs"
                  style={{
                    backgroundColor: '#bfd8af',
                    color: '#0e120e'
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill}`}
                    onClick={() => removeSkill(skill)}
                    className="rounded-sm border px-1 text-[10px] leading-none hover:opacity-80"
                    style={{
                      borderColor: '#bfd8af'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={onSkillKeyDown}
                placeholder={skills.length ? "" : undefined}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: '#0e120e' }}
                aria-describedby="skills-help"
              />
            </div>
            <p id="skills-help" className="mt-2 text-xs" style={{ color: '#0e120e' }}>
              Press Enter or comma to add each skill.
            </p>
            {errors.skills && (
              <p role="alert" className="mt-2 text-xs" style={{ color: '#dc2626' }}>
                {errors.skills.message?.toString()}
              </p>
            )}
          </div>
        )}
      />

      <div className="md:col-span-2 flex items-center justify-end gap-3">
        <Button 
          type="reset" 
          variant="outline" 
          onClick={() => reset()} 
          disabled={isSubmitting}
          style={{
            borderColor: '#bfd8af',
            color: '#0e120e',
            backgroundColor: 'transparent'
          }}
        >
          Reset
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="hover:opacity-90"
          style={{
            backgroundColor: '#99bc85',
            color: '#0e120e'
          }}
        >
          {isSubmitting ? "Saving..." : "Save and continue"}
        </Button>
      </div>
    </form>
  )
}
