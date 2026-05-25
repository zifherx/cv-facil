export type SectionType =
  | "profile"
  | "experience"
  | "education"
  | "skills"
  | "technical_skills"
  | "certifications"
  | "courses"
  | "custom_text"
  | "custom_list"
  | "custom_experience"
  | "languages"

export interface ProfileSectionData {
  text: string
}

export interface ExperienceItem {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string //rich text
}

export interface ExperienceSectionData {
  items: ExperienceItem[]
}

export interface EducationItem {
  id: string
  degree: string
  institution: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string
}

export interface EducationSectionData {
  items: EducationItem[]
}

export type SkillLevel = "Básico" | "Hábil" | "Experimentado" | "Experto"

export interface SkillItem {
  id: string
  name: string
  level: SkillLevel
}

export interface SkillsSectionData {
  items: SkillItem[]
}

export type TechnicalSkillsSectionData = SkillsSectionData

export interface LanguageItem {
  id: string
  language: string
  level: string // "Nativo" | "A1"–"C2"
}

export interface LanguagesSectionData {
  items: LanguageItem[]
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  year: string
}

export interface CertificationsSectionData {
  items: CertificationItem[]
}

export interface CourseItem {
  id: string
  name: string
  institution: string
  startDate: string
  endDate: string | null
}

export interface CoursesSectionData {
  items: CourseItem[]
}

export interface CustomTextSectionData {
  title: string
  text: string
}

export interface CustomListItem {
  id: string
  text: string
}

export interface CustomListSectionData {
  title: string
  items: CustomListItem[]
}

export type CustomExperienceSectionData = ExperienceSectionData

export type SectionData =
  | ProfileSectionData
  | ExperienceSectionData
  | EducationSectionData
  | SkillsSectionData
  | TechnicalSkillsSectionData
  | LanguagesSectionData
  | CertificationsSectionData
  | CoursesSectionData
  | CustomTextSectionData
  | CustomListSectionData
  | CustomExperienceSectionData

export interface CVSection {
  id: string
  type: SectionType
  order: number
  visible: boolean
  data: SectionData
}

export type TemplateId = "erasmus" | "hopkins" | "yale" | "oxford" | "cambridge"

export interface DocumentConfig {
  templateId: TemplateId
  color: string // hex, e.g. "#E84C3D"
  fontFamily: string // e.g. "DM Sans"
  fontSize: number // offset %, range –50 to +50
  language: string // ISO country code e.g. "PE"
}

export interface CV {
  id: string
  userId: string
  title: string
  slug: string
  sections: CVSection[]
  documentConfig: DocumentConfig
  createdAt: Date
  updatedAt: Date
}

export type CreateCVDTO = {
  userId: string
  title: string
}

export type UpdateCVTitleDTO = {
  title: string
}

export type UpdateDocumentConfigDTO = Partial<DocumentConfig>

export type UpsertSectionDTO = {
  type: SectionType
  order: number
  visible: boolean
  data: SectionData
}

export type ReorderSectionsDTO = {
  // Array de sectionIds en el nuevo orden deseado
  orderedIds: string[]
}
