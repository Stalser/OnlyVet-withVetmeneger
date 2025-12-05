// app/account/pets/page.tsx
import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function PetsPageRedirect() {
  redirect("/account?tab=pets");
}
