// lib/types.ts

// Статус заявки с сайта
// pending   — клиент отправил, ещё никто не смотрел
// in_review — регистратор / врач смотрят данные, уточняют детали
// approved  — принято решение проводить консультацию (подтверждена / запланирована)
// rejected  — заявка не будет выполнена (отменена / отклонена)
export type BookingStatus = "pending" | "in_review" | "approved" | "rejected";

// Заявка с сайта (то, что сейчас заполняется на /booking)
export interface BookingRequest {
  id: string;        // uuid
  userId?: string;   // id пользователя сайта (когда появится auth)
  createdAt: string; // ISO

  fullName: string;
  phone: string;
  telegram?: string;
  email?: string;

  petMode: "existing" | "new";
  petId?: string;          // id нашего питомца, если существует
  petName?: string;        // для нового
  petSpecies?: string;     // вид
  petNotes?: string;       // порода / возраст / вес в виде текста

  serviceId?: string;      // id из data/services или таблицы services
  doctorId?: string;       // id из data/doctors или таблицы doctors

  timeMode: "any" | "choose";
  preferredDate?: string;  // YYYY-MM-DD
  preferredTime?: string;  // HH:MM
  vmSlotId?: string;       // id слота Vetmanager, если выбран

  complaint?: string;      // кратко о проблеме (жалобы), если есть

  status: BookingStatus;
  cancelReason?: string;

  vetmanagerClientId?: number;
  vetmanagerPatientId?: number;
  vetmanagerAppointmentId?: number;
}

// Консультация (проведённый или запланированный приём)
export type ConsultationStatus = "scheduled" | "done" | "cancelled";

export interface Consultation {
  id: string;               // uuid
  userId?: string;
  petId?: string;
  bookingRequestId?: string;

  doctorId?: string;
  serviceId?: string;

  vetmanagerAppointmentId?: number;

  startTime?: string;       // ISO
  endTime?: string;         // ISO
  status: ConsultationStatus;

  summaryForOwner?: string; // краткое резюме для владельца
}
