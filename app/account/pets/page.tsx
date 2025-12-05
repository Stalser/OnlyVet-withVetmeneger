// app/account/pets/page.tsx

import { redirect } from "next/navigation";

export default function PetsPage() {
  // всегда перенаправляем на вкладку "Питомцы" в личном кабинете
  redirect("/account?tab=pets");
}
