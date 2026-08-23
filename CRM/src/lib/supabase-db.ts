import { getSupabase } from "./supabase"
import { nanoid } from "nanoid"

// Comprehensive Map of relational foreign keys for PostgREST joins
const RELATION_MAP: Record<string, Record<string, string>> = {
  Appointment: {
    doctor: "doctor:User!Appointment_doctorId_fkey(*)",
    createdBy: "createdBy:User!Appointment_createdById_fkey(*)",
    patient: "patient:Patient(*)",
  },
  Patient: {
    registeredBy: "registeredBy:User!Patient_registeredById_fkey(*)",
    appointments: "appointments:Appointment(*)",
    bills: "bills:Bill(*)",
    tags: "tags:PatientTag(*, tag:Tag(*))",
    allergies: "allergies:Allergy(*)",
    medicalAlerts: "medicalAlerts:MedicalAlert(*)",
    prescriptions: "prescriptions:Prescription(*, items:PrescriptionItem(*))",
    encounters: "encounters:Encounter(*)",
    documents: "documents:Document(*)",
    notes: "notes:PatientNote(*)",
    followUps: "followUps:FollowUp(*)",
    emergencyContacts: "emergencyContacts:EmergencyContact(*)",
    familyMembers: "familyMembers:FamilyMember(*)",
    insurances: "insurances:Insurance(*)",
    communicationPreference: "communicationPreference:CommunicationPreference(*)",
  },
  FollowUp: {
    patient: "patient:Patient(*)",
    assignedTo: "assignedTo:User!FollowUp_assignedToId_fkey(*)",
  },
  PatientTag: {
    tag: "tag:Tag(*)",
    patient: "patient:Patient(*)",
  },
  Bill: {
    patient: "patient:Patient(*)",
    items: "items:BillItem(*)",
    payments: "payments:Payment(*)",
  },
  BillItem: {
    bill: "bill:Bill(*)",
    service: "service:Service(*)",
  },
  Payment: {
    bill: "bill:Bill(*, items:BillItem(*))",
    patient: "patient:Patient(*)",
    receivedBy: "receivedBy:User!Payment_receivedById_fkey(*)",
  },
  Session: {
    user: "user:User(*)",
  },
  DoctorAvailability: {
    doctor: "doctor:User!DoctorAvailability_doctorId_fkey(*)",
  },
  Prescription: {
    patient: "patient:Patient(*)",
    doctor: "doctor:User!Prescription_doctorId_fkey(*)",
    items: "items:PrescriptionItem(*)",
  },
  PrescriptionItem: {
    prescription: "prescription:Prescription(*)",
  },
  Encounter: {
    patient: "patient:Patient(*, allergies:Allergy(*), medicalAlerts:MedicalAlert(*))",
    doctor: "doctor:User!Encounter_doctorId_fkey(*)",
    clinicalNote: "clinicalNote:ClinicalNote(*, versions:ClinicalNoteVersion(*))",
    prescriptions: "prescriptions:Prescription(*, items:PrescriptionItem(*), doctor:User!Prescription_doctorId_fkey(*))",
    reports: "reports:ClinicalReport(*, labResults:LabResultItem(*))",
    diagnoses: "diagnoses:Diagnosis(*)",
  },
  ClinicalNote: {
    versions: "versions:ClinicalNoteVersion(*)",
    doctor: "doctor:User!ClinicalNote_doctorId_fkey(*)",
  },
  ClinicalReport: {
    labResults: "labResults:LabResultItem(*)",
    doctor: "doctor:User!ClinicalReport_doctorId_fkey(*)",
    patient: "patient:Patient(*)",
  },
  ReferralNote: {
    fromDoctor: "fromDoctor:User!ReferralNote_fromDoctorId_fkey(*)",
    patient: "patient:Patient(*)",
  },
  Certificate: {
    doctor: "doctor:User!Certificate_doctorId_fkey(*)",
    patient: "patient:Patient(*)",
  },
  PatientNote: {
    author: "author:User!PatientNote_authorId_fkey(*)",
    patient: "patient:Patient(*)",
  },
  Message: {
    sentBy: "sentBy:User!Message_sentById_fkey(*)",
    patient: "patient:Patient(*)",
  },
  Expense: {
    recordedBy: "recordedBy:User!Expense_recordedById_fkey(*)",
  },
  CashSession: {
    openedBy: "openedBy:User!CashSession_openedById_fkey(*)",
    closedBy: "closedBy:User!CashSession_closedById_fkey(*)",
    payments: "payments:Payment(*)",
  },
  InventoryItem: {
    transactions: "transactions:InventoryTransaction(*)",
    alerts: "alerts:InventoryAlert(*)",
  },
  InventoryTransaction: {
    performedBy: "performedBy:User!InventoryTransaction_performedById_fkey(*)",
    patient: "patient:Patient(*)",
    item: "item:InventoryItem(*)",
  },
  AuditLog: {
    user: "user:User(*)",
  },
  WebsiteService: {
    service: "service:Service(*)",
  },
}

function buildSelect(tableName: string, include?: Record<string, any>, select?: Record<string, any>): string {
  if (!include && !select) return "*"

  const parts: string[] = []
  if (select) {
    for (const [key, val] of Object.entries(select)) {
      if (val === true) {
        parts.push(key)
      } else if (typeof val === "object") {
        const rel = RELATION_MAP[tableName]?.[key] || `${key}:${key.charAt(0).toUpperCase() + key.slice(1)}(*)`
        parts.push(rel)
      }
    }
    return parts.length > 0 ? parts.join(",") : "*"
  }

  parts.push("*")
  if (include) {
    for (const [key, val] of Object.entries(include)) {
      if (val) {
        const rel = RELATION_MAP[tableName]?.[key] || `${key}:${key.charAt(0).toUpperCase() + key.slice(1)}(*)`
        parts.push(rel)
      }
    }
  }
  return parts.join(",")
}

function applyWhere(query: any, where?: Record<string, any>) {
  if (!where) return query

  for (const [key, val] of Object.entries(where)) {
    if (val === undefined) continue

    if (key === "OR" && Array.isArray(val)) {
      const orClauses: string[] = []
      for (const item of val) {
        for (const [subKey, subVal] of Object.entries(item)) {
          if (typeof subVal === "string") {
            orClauses.push(`${subKey}.eq.${subVal}`)
          } else if (subVal && typeof subVal === "object" && "contains" in subVal) {
            orClauses.push(`${subKey}.ilike.%${(subVal as any).contains}%`)
          } else if (typeof subVal === "number" || typeof subVal === "boolean") {
            orClauses.push(`${subKey}.eq.${subVal}`)
          }
        }
      }
      if (orClauses.length > 0) {
        query = query.or(orClauses.join(","))
      }
      continue
    }

    if (val === null) {
      query = query.is(key, null)
    } else if (typeof val === "object") {
      if ("equals" in val) {
        query = val.equals === null ? query.is(key, null) : query.eq(key, val.equals)
      }
      if ("in" in val && Array.isArray(val.in)) {
        query = query.in(key, val.in)
      }
      if ("notIn" in val && Array.isArray(val.notIn)) {
        query = query.not(key, "in", `(${val.notIn.join(",")})`)
      }
      if ("not" in val) {
        query = val.not === null ? query.not(key, "is", null) : query.neq(key, val.not)
      }
      if ("contains" in val) {
        const pattern = `%${val.contains}%`
        query = val.mode === "insensitive" ? query.ilike(key, pattern) : query.like(key, pattern)
      }
      if ("startsWith" in val) {
        query = query.like(key, `${val.startsWith}%`)
      }
      if ("gte" in val) {
        query = query.gte(key, val.gte instanceof Date ? val.gte.toISOString() : val.gte)
      }
      if ("lte" in val) {
        query = query.lte(key, val.lte instanceof Date ? val.lte.toISOString() : val.lte)
      }
      if ("gt" in val) {
        query = query.gt(key, val.gt instanceof Date ? val.gt.toISOString() : val.gt)
      }
      if ("lt" in val) {
        query = query.lt(key, val.lt instanceof Date ? val.lt.toISOString() : val.lt)
      }
    } else if (val instanceof Date) {
      query = query.eq(key, val.toISOString())
    } else {
      query = query.eq(key, val)
    }
  }

  return query
}

function applyOrder(query: any, orderBy?: any) {
  if (!orderBy) return query
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy]
  for (const ord of orders) {
    for (const [col, dir] of Object.entries(ord)) {
      query = query.order(col, { ascending: dir === "asc" })
    }
  }
  return query
}

function createModelDelegate(tableName: string) {
  return {
    async findUnique(args: { where: Record<string, any>; include?: any; select?: any }) {
      const supabase = getSupabase()
      const sel = buildSelect(tableName, args.include, args.select)
      let q = supabase.from(tableName).select(sel)
      q = applyWhere(q, args.where)
      const { data, error } = await q.maybeSingle()
      if (error && error.code !== "PGRST116") {
        console.error(`[SupabaseDB ${tableName}.findUnique] error:`, JSON.stringify(error))
      }
      return data
    },

    async findFirst(args?: { where?: Record<string, any>; include?: any; select?: any; orderBy?: any }) {
      const supabase = getSupabase()
      const sel = buildSelect(tableName, args?.include, args?.select)
      let q = supabase.from(tableName).select(sel)
      q = applyWhere(q, args?.where)
      q = applyOrder(q, args?.orderBy)
      const { data, error } = await q.limit(1).maybeSingle()
      if (error && error.code !== "PGRST116") {
        console.error(`[SupabaseDB ${tableName}.findFirst] error:`, JSON.stringify(error))
      }
      return data
    },

    async findMany(args?: {
      where?: Record<string, any>
      include?: any
      select?: any
      orderBy?: any
      skip?: number
      take?: number
      distinct?: any
    }) {
      const supabase = getSupabase()
      const sel = buildSelect(tableName, args?.include, args?.select)
      let q = supabase.from(tableName).select(sel)
      q = applyWhere(q, args?.where)
      q = applyOrder(q, args?.orderBy)
      if (args?.skip !== undefined && args?.take !== undefined) {
        q = q.range(args.skip, args.skip + args.take - 1)
      } else if (args?.take !== undefined) {
        q = q.limit(args.take)
      }
      const { data, error } = await q
      if (error) {
        console.error(`[SupabaseDB ${tableName}.findMany] error:`, JSON.stringify(error))
        // Non-blocking fallback for missing relations
        return []
      }
      return data || []
    },

    async create(args: { data: Record<string, any>; include?: any; select?: any }) {
      const supabase = getSupabase()
      const payload = { ...args.data }
      if (!payload.id) {
        payload.id = tableName.toLowerCase().slice(0, 4) + "_" + nanoid(20)
      }
      const sel = buildSelect(tableName, args.include, args.select)
      const { data, error } = await supabase.from(tableName).insert(payload).select(sel).single()
      if (error) {
        console.error(`[SupabaseDB ${tableName}.create] error:`, JSON.stringify(error))
        throw new Error(error.message)
      }
      return data
    },

    async createMany(args: { data: Record<string, any>[] }) {
      const supabase = getSupabase()
      const payloads = args.data.map((d) => ({
        id: d.id || tableName.toLowerCase().slice(0, 4) + "_" + nanoid(20),
        ...d,
      }))
      const { data, error } = await supabase.from(tableName).insert(payloads).select()
      if (error) {
        console.error(`[SupabaseDB ${tableName}.createMany] error:`, JSON.stringify(error))
        throw new Error(error.message)
      }
      return { count: data?.length || 0 }
    },

    async update(args: { where: Record<string, any>; data: Record<string, any>; include?: any; select?: any }) {
      const supabase = getSupabase()
      const sel = buildSelect(tableName, args.include, args.select)
      let q = supabase.from(tableName).update(args.data)
      q = applyWhere(q, args.where)
      const { data, error } = await q.select(sel).single()
      if (error) {
        console.error(`[SupabaseDB ${tableName}.update] error:`, JSON.stringify(error))
        throw new Error(error.message)
      }
      return data
    },

    async updateMany(args: { where?: Record<string, any>; data: Record<string, any> }) {
      const supabase = getSupabase()
      let q = supabase.from(tableName).update(args.data)
      q = applyWhere(q, args.where)
      const { data, error } = await q.select()
      if (error) {
        console.error(`[SupabaseDB ${tableName}.updateMany] error:`, JSON.stringify(error))
        throw new Error(error.message)
      }
      return { count: data?.length || 0 }
    },

    async delete(args: { where: Record<string, any>; include?: any; select?: any }) {
      const supabase = getSupabase()
      const sel = buildSelect(tableName, args.include, args.select)
      let q = supabase.from(tableName).delete()
      q = applyWhere(q, args.where)
      const { data, error } = await q.select(sel).maybeSingle()
      if (error) {
        console.error(`[SupabaseDB ${tableName}.delete] error:`, JSON.stringify(error))
        throw new Error(error.message)
      }
      return data
    },

    async deleteMany(args?: { where?: Record<string, any> }) {
      const supabase = getSupabase()
      let q = supabase.from(tableName).delete()
      q = applyWhere(q, args?.where)
      const { data, error } = await q.select()
      if (error) {
        console.error(`[SupabaseDB ${tableName}.deleteMany] error:`, JSON.stringify(error))
        throw new Error(error.message)
      }
      return { count: data?.length || 0 }
    },

    async upsert(args: {
      where: Record<string, any>
      create: Record<string, any>
      update: Record<string, any>
      include?: any
      select?: any
    }) {
      const existing = await this.findFirst({ where: args.where })
      if (existing) {
        return await this.update({ where: args.where, data: args.update, include: args.include, select: args.select })
      } else {
        return await this.create({ data: { ...args.create, ...args.where }, include: args.include, select: args.select })
      }
    },

    async count(args?: { where?: Record<string, any> }) {
      const supabase = getSupabase()
      let q = supabase.from(tableName).select("*", { count: "exact", head: true })
      q = applyWhere(q, args?.where)
      const { count, error } = await q
      if (error) {
        console.error(`[SupabaseDB ${tableName}.count] error:`, JSON.stringify(error))
        return 0
      }
      return count || 0
    },
  }
}

// Table registry
const tables = [
  "User",
  "Session",
  "Counter",
  "Patient",
  "DoctorAvailability",
  "DoctorLeave",
  "Appointment",
  "WaitingListEntry",
  "Prescription",
  "PrescriptionItem",
  "Document",
  "Message",
  "PatientNote",
  "FollowUp",
  "Encounter",
  "ClinicalNote",
  "ClinicalNoteVersion",
  "DoctorTemplate",
  "DigitalSignature",
  "ClinicalReport",
  "ReferralNote",
  "Certificate",
  "Bill",
  "BillItem",
  "Payment",
  "Refund",
  "PatientAdvance",
  "AdvanceAdjustment",
  "CashSession",
  "Expense",
  "InventoryItem",
  "InventoryTransaction",
  "InventoryAlert",
  "ClinicSettings",
  "AuditLog",
  "Service",
  "Review",
  "FAQ",
  "Announcement",
  "MedicalHistory",
  "SurgicalHistory",
  "Allergy",
  "CurrentMedication",
  "ChronicDisease",
  "FamilyHistoryEntry",
  "FamilyMember",
  "EmergencyContact",
  "Insurance",
  "CommunicationPreference",
  "Tag",
  "PatientTag",
  "MedicalAlert",
  "Vitals",
  "Diagnosis",
  "LabResultItem",
  "Feedback",
]

export const db: Record<string, any> = {
  async $transaction(fnOrArray: any) {
    if (typeof fnOrArray === "function") {
      return await fnOrArray(db)
    }
    if (Array.isArray(fnOrArray)) {
      return await Promise.all(fnOrArray)
    }
    return fnOrArray
  },
}

for (const name of tables) {
  const camelName = name.charAt(0).toLowerCase() + name.slice(1)
  const delegate = createModelDelegate(name)
  db[camelName] = delegate
  db[name] = delegate
}
