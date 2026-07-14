import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function RedirectToOrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/(restaurant)/order/${id}`} />;
}
