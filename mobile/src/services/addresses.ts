import { supabase } from "../lib/supabase";
import { Address } from "../types/database";

export async function getAddresses(userId: string): Promise<Address[]> {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });
  if (error) throw error;
  return data as Address[];
}

export async function addAddress(userId: string, label: string, addressLine: string, isDefault = false) {
  if (isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
  }
  const { data, error } = await supabase
    .from("addresses")
    .insert({ user_id: userId, label, address_line: addressLine, is_default: isDefault })
    .select()
    .single();
  if (error) throw error;
  return data as Address;
}

export async function deleteAddress(id: string) {
  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) throw error;
}

export async function updateProfile(
  userId: string,
  patch: { full_name?: string; phone?: string; avatar_url?: string }
) {
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}
